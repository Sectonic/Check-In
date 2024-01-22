import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";
import { validApiRequest } from "@/lib/utils";

export default ApiRoute(
  async function handler(req, res) {

    if (!validApiRequest(req,res, "GET")) {
      return;
    }

    const { id } = req.query;
    await db.attendee.delete({
        where: {
            id: Number(id)
        }
    });

    res.status(200).end();
  }

)