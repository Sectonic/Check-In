import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import * as dayjs from 'dayjs';

var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

export default ApiRoute(async function (req, res) {
  if (req.method !== "POST") {
    res.status(504).send({ message: 'Only POST requests allowed' });
    return;
  }

  const user = req.session.user;
  if (!user || user.admin) {
    res.status(401).send({ message: 'An Organizer account is needed to access' });
    return;
  }

  const { attendeeId, meetId } = req.body;
  const attendee = await db.attendee.findFirst({
    where: {
      specificId: attendeeId,
      organizer: {
        id: user.id
      },
      meets: {
        some: {
          id: meetId
        }
      }
    }
  });

  if (!attendee) {
    res.status(409).send({ message: 'Your QR Code is invalid: ' + attendeeId });
    return;
  }

  const currentUnix = dayjs().unix();
  const currentMeet = await db.meet.findUnique({
    where: { id: meetId },
    include: {
      reoccurances: true
    }
  });
  const inTimeEvent = await db.event.findFirst({
    where: {
      startTime: { lt: currentUnix },
      endTime: { gt: currentUnix },
      meet: { id: meetId },
    }
  });

  if (!inTimeEvent && !currentMeet.reoccurance) {
    res.status(500).json({ message: 'There is no ongoing event scheduled @' + attendeeId });
    return;
  }

  if (inTimeEvent) {
    const checkAttendance = await db.attendance.findFirst({
      where: {
        event: { id: inTimeEvent.id },
        attendee: { specificId: attendeeId }
      }
    });

    if (checkAttendance) {
      res.status(409).send({ message: 'You have already submitted attendance @' + attendeeId });
      return;
    }

    const submitted = dayjs().diff(dayjs.unix(inTimeEvent.startTime), 'minute');
    var hours = dayjs.unix(inTimeEvent.endTime).diff(dayjs.unix(inTimeEvent.startTime), 'hour');
    if (hours === 0) {
      hours = dayjs.unix(inTimeEvent.endTime).diff(dayjs.unix(inTimeEvent.startTime), 'minute') / 60;
    }

    await db.attendance.create({
      data: {
        attendee: { connect: { id: attendee.id } },
        event: { connect: { id: inTimeEvent.id } },
        submitted,
        hours: Math.round(hours * 100) / 100
      }
    });

    res.status(200).json({ message: attendee.name + "'s attendance has been recorded @" + attendeeId});
  } else if (currentMeet.reoccurance) {
    const startDict = JSON.parse(currentMeet.startDict);
    const endDict = JSON.parse(currentMeet.endDict);

    [startDict, endDict].forEach(dict => {
      if (dict.time === 'PM' && dict.hour < 12) {
        dict.hour += 12;
      }
      if (dict.time === 'AM' && dict.hour === 12) {
        dict.hour = 0;
      }
    });

    const currentDict = {
      hour: dayjs().hour(),
      minute: dayjs().minute(),
      second: dayjs().second()
    };

    const currentDuration = dayjs.duration(currentDict).asSeconds();
    const startDuration = dayjs.duration({
      hour: startDict.hour,
      minute: startDict.minute,
      second: 0
    }).asSeconds();
    const endDuration = dayjs.duration({
      hour: endDict.hour,
      minute: endDict.minute,
      second: 0
    }).asSeconds();

    if ( currentDuration >= startDuration && currentDuration < endDuration) {
      if (currentMeet.scope === 'Weekly' && !currentMeet.reoccurances.map(i => i.date).includes(dayjs().day() + 1)) {
        res.status(500).json({ message: 'There is no ongoing event scheduled @' + attendeeId });
        return;
      }

      const newStartTime = dayjs().set('hour', startDict.hour).set('minute', startDict.minute).set('second', 0);
      const newEndTime = dayjs().set('hour', endDict.hour).set('minute', endDict.minute).set('second', 0);

      const newEvent = await db.event.create({
        data: {
          name: `${dayjs().format('MM/DD/YYYY')} | ${newStartTime.format('hh:mm A')} - ${newEndTime.format('hh:mm A')}`,
          meet: { connect: { id: meetId } },
          startTime: newStartTime.unix(),
          endTime: newEndTime.unix(),
          manual: currentMeet.manual,
          qr: currentMeet.qr
        }
      });

      const submitted = dayjs().diff(newStartTime, 'minute')
      var hours = newEndTime.diff(newStartTime, 'hour');
      if (hours === 0) {
          hours = newEndTime.diff(newStartTime, 'minute') / 60;
      }

      await db.attendance.create({
        data: {
          attendee: { connect: { id: attendee.id } },
          event: { connect: { id: newEvent.id } },
          submitted,
          hours: Math.round(hours * 100) / 100
        }
      });

      res.status(200).json({ message: attendee.name + "'s attendance has been recorded @" + attendeeId});
    } else {
      res.status(500).json({ message: 'There is no ongoing event scheduled @' + attendeeId });
    }
  }
});