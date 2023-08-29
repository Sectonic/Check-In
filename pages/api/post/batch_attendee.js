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
        const { newAttendees, previousAttendees } = req.body;

        await db.attendee.deleteMany({ where: { organizer: { id: user.id } } });

        for (var i = 0; i < newAttendees.length; i++) {
            const { name, id } = newAttendees[i];
            var checkedNewId = false;
            var newId = id;
            while (!id && !checkedNewId) {
                newId = randomString(10);
                if (!allSpecificIds.includes(newId)) {
                    checkedNewId = true;
                }
            }
            await db.attendee.create({
                data: {
                   name, specificId: newId,
                   organizer: { connect: { id: user.id } } 
                }
            });
        }
        
        res.status(200).send({message: 'Attendance successfully recorded'});
    }
)
