import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    const meets = await db.meet.findMany({
        where: {
            organizer: {
                id: user.id
            }
        },
        select: {
            name: true,
            image: true,
            id: true,
            organizer: {
                select: {
                    name: true
                }
            }
        }
    })
    res.status(200).json({meets});
  }
)