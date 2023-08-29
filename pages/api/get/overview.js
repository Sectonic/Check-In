import db from "@/lib/prisma";
import * as dayjs from 'dayjs';

export default async function handler(req, res) {
    var { meetId, startTime, endTime } = req.query;
    meetId = Number(meetId);
    startTime = Number(startTime);
    endTime = Number(endTime);

    const meet = await db.meet.findUnique({ where: { id: meetId } });
  
    var events = await db.event.findMany({
      where: {
        meet: { id: meetId },
        startTime: { gte: startTime },
        endTime: { lt: endTime }
      },
      include: {
        attendances: { select: { submitted: true } },
        meet: {
          select: {
            _count: { select: { attendees: true } }
          }
        },
        _count: { select: { attendances: true } }
      },
    });

    let monthFromLast;
    if (events.length === 0) {
      const lastEvent = await db.event.findFirst({
        where: { meet: { id: meetId }, startTime: { lt: startTime } },
        orderBy: { id: 'desc' },
      });
      if (lastEvent) {
        monthFromLast = dayjs.unix(lastEvent.startTime).set('date', 1).set('hour', 0).set('minute', 0);
        events = await db.event.findMany({
          where: {
            meet: { id: meetId },
            startTime: { gte: monthFromLast.unix(), lt: endTime }
          },
          include: {
            attendances: { select: { submitted: true } },
            meet: {
              select: {
                _count: { select: { attendees: true } }
              }
            },
            _count: { select: { attendances: true } }
          },
        });
      }
    }
  
    const graphPoints = events.map(event => {
      const all_attendees = event.meet._count.attendees;
      const name = dayjs.unix(event.startTime).format('MMM D');
      const tardy = event.attendances.reduce((count, attendance) => count + (attendance.submitted > (meet.tardy || attendance.submitted + 1) ? 1 : 0), 0);
      const present = event._count.attendances - tardy;
      const absent = all_attendees - (present + tardy);
      return { name, tardy, present, absent };
    });
  
    const piePoints = [{name: 'Present', value: 0}, {name: 'Absent', value: 0}, {name: 'Tardy', value: 0}];
    const counts = {};
    for (const event of events) {
      for (const attendance of event.attendances) {
        piePoints[attendance.submitted > (meet.tardy || attendance.submitted + 1) ? 2 : 0].value++;
        const num = attendance.submitted;
        counts[num] = (counts[num] || 0) + 1;
      }
      const absentValue = event.meet._count.attendees - event._count.attendances;
      piePoints[1].value += absentValue
    }
  
    const maxEventTime = () => {
      let maxMinutes = 0;
      for (const event of events) {
        const eventMinutes = dayjs.unix(event.endTime).diff(dayjs.unix(event.startTime), 'minutes');
        if (eventMinutes > maxMinutes) {
          maxMinutes = eventMinutes;
        }
      }
      return maxMinutes;
    };
  
    for (var i = 0; i < maxEventTime(); i++) {
      if (!counts.hasOwnProperty(i)) {
        counts[i] = 0
      }
    }
  
    const minutePoints = Object.entries(counts).map(([key, value]) => ({
      x: Number(key),
      y: value,
    }));

    res.status(200).send({ graphPoints, piePoints, minutePoints, newStartTime: monthFromLast?.format('YYYY-MM-DD') || null });
}