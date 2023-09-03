import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { attendees, attendance, late } = req.body;

    if (attendance === 'Not Attended') {
        await db.attendance.updateMany({
            where: { id: { in: attendees.map(attendee => Number(attendee.attendances[0].id))} },
            data: {
                attended: false,
                submitted: 0
            }
        })
    } else {
        await db.attendance.updateMany({
            where: { id: { in: attendees.map(attendee => Number(attendee.attendances[0].id))} },
            data: {
                attended: true,
                submitted: late
            }
        })
    }

    res.status(200).end();
}