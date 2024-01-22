import db from "@/lib/prisma";
import * as dayjs from 'dayjs';

export default async function handler(req, res) {
    const { attendees, attendance, late, trackAbsent, event } = req.body;

    const attendeesWithAttendance = attendees.filter(attendee => attendee.attendances.length > 0)
    const attendanceIdArray = attendeesWithAttendance.map(attendee => Number(attendee.attendances[0].id));

    if (attendance === 'Not Attended') {

        if (trackAbsent) {

            await db.attendance.updateMany({
                where: { id: { in: attendanceIdArray} },
                data: {
                    attended: false,
                    submitted: 0
                }
            })

        } else {

            await db.attendance.deleteMany({
                where: { id: { in: attendanceIdArray} }
            })

        }

    } else {

        if (trackAbsent) {

            await db.attendance.updateMany({
                where: { id: { in: attendanceIdArray} },
                data: {
                    attended: true,
                    submitted: late
                }
            })

        } else {

            const attendeesWithoutAttendances = attendees.filter(attendee => attendee.attendances.length == 0);

            var hours = dayjs.unix(event.endTime).diff(dayjs.unix(event.startTime), 'hour');
            if (hours === 0) {
                hours = dayjs.unix(event.endTime).diff(dayjs.unix(event.startTime), 'minute') / 60;
            }

            await db.attendance.createMany({
                data: attendeesWithoutAttendances.map(attendee => ({
                    attendeeId: attendee.id,
                    name: attendee.name,
                    specificId: attendee.specificId,
                    hours: Math.round(hours * 100) / 100,
                    attended: true,
                    eventId: Number(event.id)
                }))
            })

        }

    }

    res.status(200).end();
}