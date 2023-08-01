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
        const hours = dayjs.unix(startTime).diff(dayjs.unix(endTime), 'hour');
        await db.attendance.create({
            data: {
                attendee: { connect: { id: attendeeId } },
                event: { connect: { id: eventId } },
                submitted: late,
                hours
            }
        });
    }
    res.status(200).end();
}