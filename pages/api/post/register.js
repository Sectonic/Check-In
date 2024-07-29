import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import { encrypt } from "@/lib/crypt";

export default ApiRoute(
    async function handler(req, res) {
        if (req.method !== "POST") {
            res.status(504).send({ error: 'Only POST requests allowed' });
            return;
        }
        const { name, email, password } = req.body;
        const organizer_email = await db.organizer.findFirst({
            where: {email: email}
        });
        if (!organizer_email) {
            var userDict = {
                name, email,
                password: encrypt(password)
            }
            const user = await db.organizer.create({
                data: userDict
            });
            req.session.user = {
                id: user.id,
                admin: false
            };
            await req.session.save();
            res.status(200).send({ message: 'Successfully created account'});
        } else {
            res.status(409).send({ error: 'Email is already in use' });
        }
    }
)