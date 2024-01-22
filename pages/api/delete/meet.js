import { ApiRoute } from "@/lib/config";
import { deleteFile } from "@/lib/imagekit";
import db from "@/lib/prisma";
import { validApiRequest } from "@/lib/utils";

export default ApiRoute(
  async function handler(req, res) {

    if (!validApiRequest(req,res, "GET")) {
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