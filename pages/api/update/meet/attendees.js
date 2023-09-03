import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";
import * as dayjs from "dayjs";

export default ApiRoute(
  async function handler(req, res) {
    if (req.method !== "POST") {
      res.status(504).send({ error: 'Only POST requests allowed' });
      return;
    }

    const user = req.session.user;
    if (!user || user.admin) {
      res.status(401).send({ error: 'An Organizer account is needed to access' });
      return;
    }

    const { inside, outside, meet } = req.body;

    const updatePromises = [];

    if (outside.length > 0) {
      updatePromises.push(
        ...outside.map(id => 
          db.attendee.update({
            where: { id },
            data: {
              meets: {
                disconnect: [{ id: Number(meet) }]
              }
            }
          })
        )
      );

      updatePromises.push(
        db.attendance.deleteMany({
          where: { 
            event: { startTime: { gt: dayjs().unix() }, meet: { id: Number(meet)} },
            attendee: { id: { in: outside } },
            attended: false
          },
        })
      );
    }

    if (inside.length > 0) {
      updatePromises.push(
        ...inside.map(id => 
          db.attendee.update({
            where: { id },
            data: {
              meets: {
                connect: [{ id: Number(meet) }]
              }
            }
          })
        )
      );

      const allFutureEvents = await db.event.findMany({ where: { meet: { id: Number(meet) }, endTime: { gt: dayjs().unix() } } });

      for (let i = 0; i < allFutureEvents.length; i++) {
        const futureEvent = allFutureEvents[i];
        let hours = dayjs.unix(futureEvent.endTime).diff(dayjs.unix(futureEvent.startTime), 'hour');
        const attendeesPromises = [];

        if (hours === 0) {
          hours = dayjs.unix(futureEvent.endTime).diff(dayjs.unix(futureEvent.startTime), 'minute') / 60;
        }

        for (let j = 0; j < inside.length; j++) {
          const attendeeId = inside[j];
          attendeesPromises.push(
            db.attendance.create({
              data: {
                attendee: { connect: { id: attendeeId } },
                event: { connect: { id: futureEvent.id } },
                hours: Math.round(hours * 100) / 100
              }
            })
          );
        }

        updatePromises.push(...attendeesPromises);
      }
    }

    try {
      await Promise.all(updatePromises);
      res.status(200).end();
    } catch (error) {
      console.error('Error updating attendees:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
);