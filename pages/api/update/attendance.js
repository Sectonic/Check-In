import db from "@/lib/prisma";
import * as dayjs from 'dayjs';

export default async function handler(req, res) {
    const { attendanceId, attendance, late, eventId, attendeeId, startTime, endTime } = req.body;
    if (attendance === 'Not Attended' && attendanceId) {
        await db.attendance.delete({ where: { id: attendanceId } });
    } else if (attendance === 'Attended' && attendanceId) {
        await db.attendance.update({
            where: { id: attendanceId },
            data: { submitted: late }
        });
    } else if (attendance === 'Attended' && !attendanceId) {
        var hours = dayjs.unix(endTime).diff(dayjs.unix(startTime), 'hour');
        if (hours === 0) {
            hours = dayjs.unix(endTime).diff(dayjs.unix(startTime), 'minute') / 60;
        }
        await db.attendance.create({
            data: {
                attendee: { connect: { id: attendeeId } },
                event: { connect: { id: eventId } },
                submitted: late,
                hours: Math.round(hours * 100) / 100
            }
        });
    }
    res.status(200).end();
}