import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import { randomString } from "@/lib/extra";

export default ApiRoute(
    async function (req, res) {
        if (req.method !== "POST") {
            res.status(504).send({ error: 'Only POST requests allowed' });
            return;
        }
        const user = req.session.user;
        if (!user || user.admin) {
            res.status(401).send({ error: 'A Organizer account is needed to access'});
            return;
        }
        const { name, id } = req.body;
        const usedName = !!await db.attendee.findFirst({
            where: {
                name: name
            }
        });
        if (usedName) {
            res.status(409).send({ error: 'An Attendee already has this name'});
            return;
        }
        const allSpecificIds = await db.attendee.findMany({
            where: {
                organizer: {
                    id: user.id
                }
            },
            select: {
                specificId: true
            }
        });
        if (id) {
            const usedId = !!await db.attendee.findFirst({
                where: {
                    specificId: id
                }
            });
            if (usedId) {
                res.status(409).send({ error: 'An Attendee already has this ID'});
                return; 
            }
        }
        const newData = {
            name,
            organizer: {
                connect: {
                    id: user.id
                }
            }
        }
        if (id) {
            newData.specificId = id;
        } else {
            var checkedNewId = false;
            var newId;
            while (!checkedNewId) {
                newId = randomString(16);
                if (!allSpecificIds.includes(newId)) {
                    checkedNewId = true;
                }
            }
            newData.specificId = newId;
            
        }
        await db.attendee.create({
            data: newData
        });
        res.status(200).send({message: 'Attendance successfully recorded'});
    }
)