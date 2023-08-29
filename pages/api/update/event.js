import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'A Organizer account is needed to access'});
        return;
    }

    const { meetId, id, name } = req.query;

    const nameExists = await db.event.findFirst({
        where: { name, meet: { id: Number(meetId) } }
    })

    if (nameExists) {
        res.status(500).json({ error: 'Another event in this meet has this name.' })
    } else {
        await db.event.update({
            where: {
                id: Number(id)
            },
            data: {
                name
            }
        });
        res.status(200).end();
    }
  }
)