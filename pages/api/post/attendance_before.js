import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import { decrypt } from "@/lib/crypt";
import * as dayjs from 'dayjs';

export default ApiRoute(
    async function (req, res) {
        if (req.method !== "POST") {
            res.status(504).send({ error: 'Only POST requests allowed' });
            return;
        }
        const { verify, attendee, answers } = req.body;
        const event = await db.event.findFirst({
            where: {id:decrypt(verify)}
        });
        if (!event) {
            res.status(401).send({ error: 'You do not have authority to create a meet'});
            return;
        }
        var start = dayjs.unix(event.startTime);
        var end = dayjs.unix(event.endTime);
        var between = Math.round(end.diff(start, 'hour', true) * 10) / 10;
        const attendeeDict = {
            attendee: {
                id: attendee
            },
            event: {
                id: event.id
            },
            hours: between,
        }
        if (answers) {
            attendeeDict.answers = {
                create: answers
            }
        }
        await db.attendance.create({
            data: attendeeDict
        })
        res.status(200).send({message: 'Attendance successfully recorded'});
    }
)