import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'An account is needed to access'});
        return;
    }

    const { name } = req.query;

    if (user.admin) {
        await db.organization.update({
            where: {
                id: user.id
            },
            data: {
                name
            }
        });
    } else {
        await db.organizer.update({
            where: {
                id: user.id
            },
            data: {
                name
            }
        });
    }

    res.status(200).end();
  }
)