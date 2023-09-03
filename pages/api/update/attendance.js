import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { attendanceId, attendance, late } = req.body;
    if (attendance === 'Not Attended') {
        await db.attendance.update({ 
            where: { id: attendanceId },
            data: { submitted: 0, attended: false }
        });
    } else if (attendance === 'Attended') {
        await db.attendance.update({
            where: { id: attendanceId },
            data: { submitted: late, attended: true }
        });
    }
    res.status(200).end();
}