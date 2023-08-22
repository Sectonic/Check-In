import { ApiRoute } from "@/lib/config";
import { deleteFile } from "@/lib/imagekit";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'A Organizer account is needed to access'});
        return;
    }
    const { id } = req.body;
    const deletedMeet = await db.meet.delete({
        where: {
            id: Number(id)
        }
    });
    if (deletedMeet.imageId) {
      deleteFile(deletedMeet.imageId);
    }
    req.session.user.meets.splice(req.session.user.meets.indexOf(id), 1);
    await req.session.save();
    res.status(200).end();
  }
)