import { ApiRoute } from "@/lib/config";
import { deleteFile, uploadFile } from "@/lib/imagekit";
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
        res.status(401).send({ error: 'A Organizer account is needed to access'});
        return;
    }

    const { oldFileId, meetId, name, startDict, endDict, scope, reoccurances, imageB64, tardy, trackAbsent, inclusive } = req.body;

    const sameName = await db.meet.findFirst({
        where: { name, id: { not: meetId } }
    });

    if (sameName) {
        res.status(409).json({ error: 'A meet already has this name' });
    }

    const updatingEntry = {
        name, startDict, endDict, scope, trackAbsent, inclusive,
        reoccurances: {
            create: reoccurances.map(i => {
                if (i) {
                    return {date: i}
                }
            })
        },
    };

    if (inclusive) {
        updatingEntry.attendees = {
            set: []
        };
    }

    updatingEntry.tardy = tardy !== "" ? Number(tardy) : null;

    if (imageB64) {
        deleteFile(oldFileId)
        const { id, url } = await uploadFile(name, imageB64, '/meets/');
        updatingEntry.image = url;
        updatingEntry.imageId = id;
    }

    await db.reoccurance.deleteMany({
        where: { meet: { id: meetId } }
    })

    await db.meet.update({
        where: { id: meetId },
        data: updatingEntry
    })

    if (trackAbsent) {

        const allAttendees = inclusive ? 
            await db.attendee.findMany({ where: { organizer: { id: user.id } } }) : 
            await db.attendee.findMany({ where: { meets: { some: { id: meetId } } } });

        const attendanceCreationQueries = []

        for (var i = 0; i < allAttendees.length; i++) {

            const attendee = allAttendees[i];

            const eventsWithoutAttendee = await db.event.findMany({
                where: {
                    startTime: { gt: dayjs().unix() }, meet: { id: meetId },
                    NOT: { attendances: { some: { specificId: attendee.specificId } } }
                },
                select: { id: true, startTime: true, endTime: true }
            });

            const attendeeQuery = db.attendance.createMany({
                data: eventsWithoutAttendee.map(event => {

                    let hours = dayjs.unix(event.endTime).diff(dayjs.unix(event.startTime), 'hour');
                    if (hours === 0) {
                        hours = dayjs.unix(event.endTime).diff(dayjs.unix(event.startTime), 'minute') / 60;
                    }

                    return {
                        attendeeId: attendee.id,
                        eventId: event.id,
                        hours: Math.round(hours * 100) / 100,
                        name: attendee.name,
                        specificId: attendee.specificId
                    }
                })
            })

            attendanceCreationQueries.push(attendeeQuery);

        }

        await db.$transaction(attendanceCreationQueries);

    } else {

        await db.attendance.deleteMany({
            where: { 
                event: { startTime: { gt: dayjs().unix() }, meet: { id: meetId },  },
                attended: false
            },
        })

    }

    res.status(200).end();
    
  }
)