import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { organizerId, eventId, meetId, inclusive } = req.query;

    const include = eventId ? {
        include: {
            attendances: { 
                where: { event: { id: Number(eventId) } }
            },
            
        }
    } : {};

    const attendees = inclusive == 'true' ? 
        await db.attendee.findMany({
            where: { organizer: { id: Number(organizerId) } },
            ...include
        }) :
        await db.attendee.findMany({
            where: { 
                meets: { some: { id: Number(meetId) } }
            },
            ...include
        })

    res.status(200).send({ attendees });
}