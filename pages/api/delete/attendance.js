import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'A Organizer account is needed to access'});
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