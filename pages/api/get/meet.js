import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { meetId } = req.query;
    const meet = await db.meet.findFirst({
        where: {
            id: Number(meetId)
        },
        include: {
            reoccurances: true
        }
    })
    res.status(200).json({meet});
}