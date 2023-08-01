import db from "@/lib/prisma";
import * as dayjs from 'dayjs';

export default async function handler(req, res) {
  const { search, meetId, eventId, startTime, endTime } = req.query;

  var events = await db.event.findMany({
    where: {
      meet: { id: Number(meetId) },
      startTime: { gte: Number(startTime), lt: Number(endTime) }
    },
    orderBy: { id: 'desc' },
  });

  let monthFromLast;
  if (events.length === 0) {
    const lastEvent = await db.event.findFirst({
      where: { meet: { id: Number(meetId) } },
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

  const correctEventId = eventId || events[0]?.id || 'undefined';

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

  const currentEvent = events.find(event => event.id === Number(correctEventId)) || null;

  res.status(200).send({ events, attendance, currentEvent, notAttended, newStartTime: monthFromLast?.format('YYYY-MM-DD') || null });
}