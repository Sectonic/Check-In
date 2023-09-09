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
        
        const { newAttendees, oldAttendees } = req.body;

        const dontDelete = [];

        await db.attendee.createMany({
            data: newAttendees.map(attendee => {
                const { name, id } = attendee;
                if (name) {
                    dontDelete.push(id);
                    if (!oldAttendees.some(oldAttendee => name === oldAttendee.name && id === oldAttendee.specificId)) {
                        var checkedNewId = false;
                        var newId = id;
                        while (!id && !checkedNewId) {
                            newId = randomString(10);
                            if (!dontDelete.includes(newId)) {
                                checkedNewId = true;
                            }
                        }
                        return {
                            name, specificId: newId, organizerId: user.id
                        }
                    }
                }
            })
        });

        await db.attendee.deleteMany({ where: { organizer: { id: user.id }, id: { notIn: dontDelete } } });
        
        res.status(200).send({message: 'Attendance successfully recorded'});
    }
)
