import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import { decrypt } from "@/lib/crypt";

export default ApiRoute(
    async function handler(req, res) {
        if (req.method !== "POST") {
            res.status(504).send({ error: 'Only POST requests allowed' });
            return;
        }
        const { verify, name, startTime, endTime, manual, tag, qr } = req.body;
        const meet = await db.meet.findFirst({
            where: {id:decrypt(verify)}
        });
        if (!meet) {
            res.status(401).send({ error: 'You do not have authority to create a meet'});
            return;
        }
        const name_exists = !!await db.event.findFirst({
            where: {name}
        });
        if (name_exists) {
            res.status(409).send({ error: 'This name already exists in an event for this meet'});
            return;
        }
        const eventDict = {
            name, startTime, endTime,
            meet: {
                id: meet.id
            }
        }
        if (tag) {
            eventDict.tag = tag;
        }
        eventDict.qr = meet.reoccurance ? meet.qr : qr;
        eventDict.manual = meet.reoccurance ? false : manual;
        await db.event.create({
            data: eventDict
        });
        res.status(200).send({error: 'Successfully created event'});
    }
)