import db from "@/lib/prisma";
import * as dayjs from 'dayjs';

export default async function handler(req, res) {
  const { search, meetId, eventId, startTime, endTime } = req.query;

  console.log(meetId, eventId);

  const checkDurationHours = (dict) => {
    if (dict.time === 'PM' && dict.hour < 12) {
        return dict.hour + 12;
    }
    if (dict.time === 'AM' && dict.hour === 12) {
        return 0
    }
    return dict.hour;
  }

  const meet = await db.meet.findUnique({ 
    where: { id: Number(meetId ) },
    include: { reoccurances: true }
  });
  
  const reoccurances = meet.reoccurances.map(reoccurance => reoccurance.date);

  var newEvent = false;
  if (meet.scope === 'Daily') {
    newEvent = true;
  } else if (meet.scope === 'Weekly') {
    if (reoccurances.includes(dayjs().day() + 1)) newEvent = true;
  }

  if (newEvent) {
    const startDict = JSON.parse(meet.startDict);
    const endDict = JSON.parse(meet.endDict);
    const startTime = dayjs().set('hour', checkDurationHours(startDict)).set('minute', startDict.minute).set('second', 0);
    const endTime = dayjs().set('hour', checkDurationHours(endDict)).set('minute', endDict.minute).set('second', 0);
    const event = await db.event.findFirst({
      where: { 
        meet: { id: meet.id },
        startTime: startTime.unix(),
        endTime: endTime.unix()
      }
    });
    if (!event) {
      await db.event.create({
        data: {
          name: `${dayjs().format('MM/DD/YYYY')} | ${startTime.format('hh:mm A')} - ${endTime.format('hh:mm A')}`,
          meet: { connect: { id: meet.id } },
          startTime: startTime.unix(),
          endTime: endTime.unix(),
          manual: meet.manual,
          qr: meet.qr
        }
      });
    }
  }
  

  var events = await db.event.findMany({
    where: {
      meet: { id: Number(meetId) },
      startTime: { gte: Number(startTime), lt: Number(endTime) }
    },
    orderBy: { id: 'desc' },
  });

  const futureEvents = await db.event.findMany({
    where: {
      meet: { id: Number(meetId) },
      startTime: { gte: Number(endTime) }
    },
    orderBy: { id: 'desc' },
  });

  let monthFromLast;
  if (events.length === 0) {
    const lastEvent = await db.event.findFirst({
      where: { meet: { id: Number(meetId) }, startTime: { lt: Number(startTime) } },
      orderBy: { id: 'desc' },
    });
    if (lastEvent) {
      monthFromLast = dayjs.unix(lastEvent.startTime).set('date', 1).set('hour', 0).set('minute', 0);
      events = await db.event.findMany({
        where: {
          meet: { id: Number(meetId) },
          startTime: { gte: monthFromLast.unix(), lt: Number(endTime) }
        },
        orderBy: { id: 'desc' },
      });
    }
  }

  const correctEventId = eventId || events[0]?.id || futureEvents[0]?.id || 'undefined';

  let attendance = [];
  let notAttended = [];

  if (correctEventId !== 'undefined') {
    attendance = await db.attendance.findMany({
      where: {
        event: { id: Number(correctEventId) },
        attendee: { OR: [{ name: { contains: search } }, { specificId: { contains: search } }] },
      },
      include: { attendee: { select: { id: true, specificId: true, name: true } } },
    });

    notAttended = await db.attendee.findMany({
      where: {
        meets: { some: { id: Number(meetId) } },
        id: { notIn: attendance.map(i => i.attendee.id) },
        OR: [{ name: { contains: search } }, { specificId: { contains: search } }]
      },
    });
  }

  const currentEvent = events.find(event => event.id === Number(correctEventId)) || futureEvents.find(event => event.id === Number(correctEventId)) || null;

  res.status(200).send({ events, futureEvents, attendance, currentEvent, notAttended, newStartTime: monthFromLast?.format('YYYY-MM-DD') || null });
}