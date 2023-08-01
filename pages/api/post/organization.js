import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";
import { encrypt } from "@/lib/crypt";

export default ApiRoute(
    async function handler(req, res) {
        if (req.method !== "POST") {
            res.status(504).send({ error: 'Only POST requests allowed' });
            return;
        }
        const { name, email, password, password2 } = req.body;
        if (password !== password2 ) {
            res.status(409).send({ error: 'Passwords do not match' });
            return;
        }
        const organizer_email = !await db.organizer.findFirst({
            where: {email: email}
        });
        const organization_email = !await db.organizer.findFirst({
            where: {email: email}
        })
        let unique = organization_email && organizer_email;
        if (unique) {
            var randCode = Math.floor(100000 + Math.random() * 900000);
            const user = await db.organizer.create({
                data: {
                    name, email,
                    password: encrypt(password),
                    code: randCode
                }
            });
            req.session.user = {
                id: user.id,
                admin: true
            };
            await req.session.save();
            res.status(200).send({ message: 'Successfully created account'});
        } else {
            res.status(409).send({ error: 'Email is already in use' });
        }
    }
)