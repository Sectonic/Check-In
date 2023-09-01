import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'An account is needed to access'});
        return;
    }

    if (user.admin) {
        await db.organization.delete({
            where: {
                id: user.id
            }
        });
    } else {
        await db.organizer.delete({
            where: {
                id: user.id
            }
        });
    }

    res.status(200).end();
  }
)