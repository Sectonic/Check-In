import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import * as dayjs from "dayjs";

export default ApiRoute(
    async function handler(req, res) {
        if (req.method !== "POST") {
            res.status(504).send({ error: 'Only POST requests allowed' });
            return;
        }

        const user = req.session.user;
        if (!user || user.admin) {
            res.status(401).send({ error: 'A Organizer account is needed to access'});
            return;
        }

        const { meetId,  name, startTime, endTime, } = req.body;

        const meet = await db.meet.findFirst({
            where: {id:Number(meetId)},
        });

        const attendees = meet.inclusive ? 
            await db.attendee.findMany({ where: { organizer: { id: user.id } } }) : 
            await db.attendee.findMany({ where: { meets: { some: { id: meet.id } } } });

        if (!meet) {
            res.status(401).send({ error: 'You do not have authority to create a meet'});
            return;
        }
        const name_exists = !!await db.event.findFirst({
            where: {name, meet: { id: Number(meetId) } }
        });
        if (name_exists) {
            res.status(409).send({ error: 'This name already exists in an event for this meet'});
            return;
        }
        var hours = dayjs.unix(endTime).diff(dayjs.unix(startTime), 'hour');
        if (hours === 0) {
            hours = dayjs.unix(endTime).diff(dayjs.unix(startTime), 'minute') / 60;
        }
        const eventDict = {
            name, startTime, endTime, 
            multipleSubmissions: meet.multipleSubmissions,
            attendances: {
                create: meet.trackAbsent ? attendees.map(attendee => ({
                    attendeeId: attendee.id,
                    name: attendee.name,
                    specificId: attendee.specificId,
                    hours: Math.round(hours * 100) / 100
                })) : []
            },
            meet: {
                connect: {
                    id: meet.id
                }
            }
        }
        const event = await db.event.create({
            data: eventDict
        });
        res.status(200).send({eventId: event.id});
    }
)