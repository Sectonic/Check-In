import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { organizerId, search } = req.query;

    const attendees = await db.attendee.findMany({
        where: {
            organizer: {
                id: Number(organizerId)
            },
            OR: [
                { name: { contains: search } },
                { specificId: { contains: search } }
            ]
        },
        select: {
            name: true,
            specificId: true
        }
    });

    res.status(200).send({ attendees });
}