import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    if (!user) {
        res.status(401).send({ error: 'A Organizer account is needed to access'});
        return;
    }
    const { id, name, specificId } = req.query;
    const usedName = !!await db.attendee.findFirst({
        where: {
            id: { not: Number(id)},
            name: name
        }
    });
    if (usedName) {
        res.status(409).send({ error: 'An Attendee already has this name'});
        return;
    }
    const usedId = !!await db.attendee.findFirst({
        where: {
            id: { not: Number(id)},
            specificId: specificId
        }
    });
    if (usedId) {
        res.status(409).send({ error: 'An Attendee already has this ID'});
        return; 
    }
    await db.attendee.update({
        where: {
            id: Number(id)
        },
        data: {
            name, specificId
        }
    })
    res.status(200).end();
  }
)