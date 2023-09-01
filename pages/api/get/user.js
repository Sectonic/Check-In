import { ApiRoute } from "@/lib/config";
import exclude from "@/lib/exclude";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    var userInfo = {};
    if (user) {
      if (user.admin) {
        userInfo = await db.organization.findFirst({
          where: {
            id: user.id
          }
        })
      } else {
        userInfo = await db.organizer.findFirst({
          where: {
            id: user.id
          }
        })
      }
    }
    userInfo = exclude(userInfo, ['password'])
    res.status(200).json({...userInfo, active: true});
  }
)
