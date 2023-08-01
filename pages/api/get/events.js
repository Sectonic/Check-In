import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { startTime, endTime, meetId } = req.query;

    const events = await db.event.findMany({
        where: { 
            meet: { id: Number(meetId) },
            AND: [
                { startTime: { gte: Number(startTime) } }, 
                { startTime: { lt: Number(endTime) } }
            ]
        },
        orderBy: { id: 'desc' },
    });

    res.status(200).send({ events });
}