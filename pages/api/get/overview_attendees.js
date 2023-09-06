import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { organizerId, search, all } = req.query;

    const searchQuery = search === '' ? { } : { OR: [
        { name: { contains: search } },
        { specificId: { contains: search } }
    ] };
    const takeQuery = all === 'true' ? {} : (search === '' ? { take: 5 } : {});

    const attendees = await db.attendee.findMany({
        where: {
            organizer: {
                id: Number(organizerId)
            },
            ...searchQuery,
        },
        ...takeQuery,
        orderBy: {
            id: 'desc'
        },
        select: {
            name: true,
            specificId: true
        }
    });

    res.status(200).send({ attendees });
}