import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { organizerId, eventId, meetId } = req.query;

    const attendees = await db.attendee.findMany({
        where: { 
            organizer: { id: Number(organizerId) },
            meets: {
                some: {
                    id: Number(meetId)
                }
            }
        },
        include: {
            attendances: { 
                where: { event: { id: Number(eventId) } }
            }
        }
    })

    res.status(200).send({ attendees });
}