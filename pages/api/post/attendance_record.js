import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import * as dayjs from 'dayjs';

export default ApiRoute(
    async function (req, res) {
        if (req.method !== "POST") {
            res.status(504).send({ error: 'Only POST requests allowed' });
            return;
        }

        const user = req.session.user;
        if (!user || user.admin) {
            res.status(401).send({ error: 'A Organizer account is needed to access'});
            return;
        }
        
        const { attendee, event, attendance, late } = req.body;

        const InEvent = await db.attendance.findFirst({
            where: {
                attendee: { id: Number(attendee.id) },
                event: { id: Number(event.id) }
            }
        });

        if (InEvent) {
            res.status(409).send({ error: "Attendance record already exists in this event"});
            return;
        }

        const hours = dayjs(event.endTime).diff(dayjs(event.startTime), 'hour');

        await db.attendance.create({
            data: {
                event: { connect: { id: Number(event.id) } },
                attendee: { connect: { id: Number(attendee.id) } },
                name: attendee.name,
                specificId: attendee.specificId,
                attended: attendance === 'Attended',
                submitted: attendance === 'Attended' ? late : 0,
                hours: Math.round(hours * 100) / 100
            }
        })
    
        res.status(200).end();
    }
)
