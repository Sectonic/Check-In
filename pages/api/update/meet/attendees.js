import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(504).send({ error: 'Only POST requests allowed' });
        return;
    }
    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'A Organizer account is needed to access'});
        return;
    }
    const { inside, outside, meet } = req.body;

    if (outside.length > 0) {
        for (var i = 0; i < outside.length; i++) {
            let id = outside[i];
            await db.attendee.update({
                where: {id},
                data: {
                    meets: {
                        disconnect: [{ id: Number(meet)}]
                    }
                }
            })
        }
    }
    if (inside.length > 0) {
        for (var i = 0; i < inside.length; i++) {
            let id = inside[i];
            await db.attendee.update({
                where: {id},
                data: {
                    meets: {
                        connect: [{ id: Number(meet)}]
                    }
                }
            })
        }
    }
    
    res.status(200).end();
  }
)