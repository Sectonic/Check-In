import { ApiRoute } from "@/lib/config";
import { deleteFile, uploadFile } from "@/lib/imagekit";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(504).send({ error: 'Only POST requests allowed' });
        return;
    }
    const user = req.session.user;
    if (!user || user.admin) {
        res.status(401).send({ error: 'A Organizer account is needed to access'});
        return;
    }
    const { oldFileId, meetId, name, startDict, endDict, scope, reoccurances, imageB64, tardy } = req.body;
    const sameName = await db.meet.findFirst({
        where: { name, id: { not: meetId } }
    });
    if (sameName) {
        res.status(409).json({ error: 'A meet already has this name' });
    }
    const updatingEntry = {
        name, startDict, endDict, scope, 
        reoccurances: {
            create: reoccurances.map(i => {
                if (i) {
                    return {date: i}
                }
            })
        }
    };
    updatingEntry.tardy = tardy !== "" ? Number(tardy) : null;
    if (imageB64) {
        deleteFile(oldFileId)
        const { id, url } = await uploadFile(name, imageB64);
        updatingEntry.image = url;
        updatingEntry.imageId = id;
    }
    await db.reoccurance.deleteMany({
        where: { meet: { id: meetId } }
    })
    await db.meet.update({
        where: { id: meetId },
        data: updatingEntry
    })
    res.status(200).end();
  }
)