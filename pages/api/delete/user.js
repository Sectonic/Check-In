import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";
import { validApiRequest } from "@/lib/utils";

export default ApiRoute(
  async function handler(req, res) {

    if (!validApiRequest(req,res, "GET")) {
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