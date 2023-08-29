import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'A Organizer account is needed to access'});
        return;
    }
    const { id } = req.query;
    await db.event.delete({
        where: {
            id: Number(id)
        }
    });
    res.status(200).end();
  }
)