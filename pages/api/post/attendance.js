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

  const currentMeet = await db.meet.findUnique({
    where: { id: meetId },
    include: {
      reoccurances: true,
    }
  });

  const attendee = currentMeet.inclusive ? 
    await db.attendee.findFirst({
      where: {
        specificId: attendeeId,
        organizer: { id: user.id }
      }
    }) : 
    await db.attendee.findFirst({
      where: {
        specificId: attendeeId,
        meets: { some: { id: currentMeet.id } }
      }
    });

  if (!attendee) {
    res.status(409).send({ message: 'Invalid Code', id: attendeeId });
    return;
  }

  const currentUnix = dayjs().unix();
  const inTimeEvent = await db.event.findFirst({
    where: {
      startTime: { lt: currentUnix },
      endTime: { gt: currentUnix },
      meet: { id: meetId },
    }
  });

  if (!inTimeEvent && !currentMeet.reoccurance) {
    res.status(500).json({ message: 'No ongoing event', id: attendeeId });
    return;
  }

  if (inTimeEvent) {

    const checkAttendance = await db.attendance.findFirst({
      where: {
        event: { id: inTimeEvent.id },
        attendee: { specificId: attendeeId }
      }
    });

    if (!currentMeet.multipleSubmissions && checkAttendance && checkAttendance.attended) {
      res.status(200).send({ message: 'Already submitted', id: attendeeId });
      return;
    }

    const submitted = dayjs().diff(dayjs.unix(inTimeEvent.startTime), 'minute');

    if (currentMeet.trackAbsent) {

      await db.attendance.update({
        where: { id: checkAttendance.id },
        data: {
          attended: true,
          submitted
        }
      });

    } else {

      var hours = inTimeEvent.endTime.diff(inTimeEvent.startTime, 'hour');
      if (hours === 0) {
          hours = inTimeEvent.endTime.diff(inTimeEvent.startTime, 'minute') / 60;
      }

      await db.attendance.create({
        data: {
          eventId: inTimeEvent.id,
          attendeeId: attendee.id,
          attended: true,
          submitted,
          name: attendee.name,
          specificId: attendee.specificId,
          hours: Math.round(hours * 100) / 100
        }
      })

    }

    res.status(200).json({ message: "Attendance recorded", id: attendeeId});
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
        res.status(500).json({ message: 'No ongoing event', id: attendeeId });
        return;
      }

      const newStartTime = dayjs().set('hour', startDict.hour).set('minute', startDict.minute).set('second', 0);
      const newEndTime = dayjs().set('hour', endDict.hour).set('minute', endDict.minute).set('second', 0);

      const submitted = dayjs().diff(newStartTime, 'minute')
      var hours = newEndTime.diff(newStartTime, 'hour');
      if (hours === 0) {
          hours = newEndTime.diff(newStartTime, 'minute') / 60;
      }

      const attendees = currentMeet.inclusive ? 
        await db.attendee.findMany({ where: { organizer: { id: user.id } } }) : 
        await db.attendee.findMany({ where: { meets: { some: { id: currentMeet.id } } } });

      const newEvent = await db.event.create({
        data: {
          name: `${dayjs().format('MM/DD/YYYY')} | ${newStartTime.format('hh:mm A')} - ${newEndTime.format('hh:mm A')}`,
          meet: { connect: { id: meetId } },
          startTime: newStartTime.unix(),
          endTime: newEndTime.unix(),
          attendances: {
            create: currentMeet.trackAbsent ? attendees.map(attendee => ({
              name: attendee.name,
              specificId: attendee.specificId,
              attendeeId: attendee.id,
              hours: Math.round(hours * 100) / 100
            })) : []
          }
        }
      });

      if (currentMeet.trackAbsent) {

        await db.attendance.updateMany({
          where: {
            eventId: newEvent.id,
            attendeeId: attendee.id
          },
          data: {
            attended: true,
            submitted,
          }
        });

      } else {

        await db.attendance.create({
          data: {
            eventId: newEvent.id,
            attendeeId: attendee.id,
            attended: true,
            submitted,
            name: attendee.name,
            specificId: attendee.specificId,
            hours: Math.round(hours * 100) / 100
          }
        });

      }

      res.status(200).json({ message: "Attendance recorded", id: attendeeId});
    } else {
      res.status(500).json({ message: 'No ongoing event', id: attendeeId });
    }
  }
});