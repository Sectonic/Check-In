import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";

export default ApiRoute(
    async function handler(req, res) {
        const { search, all } = req.query;
        const user = req.session.user;

        const searchQuery = search === '' ? { } : { OR: [
            { name: { contains: search } },
            { specificId: { contains: search } }
        ] };
        const takeQuery = all === 'true' ? {} : (search === '' ? { take: 5 } : {});
    
        const attendees = await db.attendee.findMany({
            where: {
                organizer: {
                    id: user.id
                },
                ...searchQuery,
            },
            ...takeQuery,
            orderBy: {
                id: 'desc'
            },
            select: {
                id: true,
                name: true,
                specificId: true
            }
        });
    
        res.status(200).send({ attendees }); 
    }
)
