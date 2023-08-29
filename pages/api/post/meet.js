import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import { uploadFile } from "@/lib/imagekit";

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
        const { name, reoccurance, qr, image, startDict, endDict, manual, scope, reoccurances, tardy } = req.body;
        const name_exists = !!await db.meet.findFirst({
            where: {name}
        });
        if (name_exists) {
            res.status(409).send({ error: 'A meet already has this name'});
            return;
        }
        const meetDict = {
            name, reoccurance, qr, manual, 
            organizer: {
                connect: {
                    id: user.id
                }
            }
        }
        if (tardy !== '') {
            meetDict.tardy = Number(tardy);
        }
        if (image) {
            const { id, url } = await uploadFile(name, image);
            meetDict.image = url;
            meetDict.imageId = id;
        }
        if (scope) {
            meetDict.startDict = startDict;
            meetDict.endDict = endDict;
            meetDict.scope = scope;
            if (scope != 'Daily') {
                var reoccurancesArr = [];
                reoccurances.forEach(val => {
                    reoccurancesArr.push({date:val});
                });
                meetDict.reoccurances = {
                    create: reoccurancesArr
                };
            }
        }
        const newMeet = await db.meet.create({
            data: meetDict
        });
        if ("meets" in req.session.user) {
            req.session.user.meets.push(newMeet.id);
        } else {
            req.session.user.meets = [newMeet.id]
        }
        await req.session.save()
        res.status(200).send({id: newMeet.id});
    }
)