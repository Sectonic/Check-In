import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";
import { validApiRequest } from "@/lib/utils";

export default ApiRoute(
  async function handler(req, res) {

    if (!validApiRequest(req,res, "GET")) {
      return;
    }

    const { attendanceId } = req.query;
    await db.attendance.delete({
        where: {
            id: Number(attendanceId)
        }
    });

    res.status(200).end();
  }
)