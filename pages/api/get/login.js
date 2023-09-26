import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";
import { checkSimilar } from '@/lib/crypt';

export default ApiRoute(
    async function handler(req, res) {
        const { email, password } = req.query;
        let currentUser;
        let meets;
        let organization;

        const organizationExists = await db.organization.findFirst({
            where: { email },
        });

        if (organizationExists) {
            currentUser = organizationExists;
            organization = true;
        } else {
            const organizerExists = await db.organizer.findFirst({
                where: { email },
                select: {
                    id: true,
                    password: true,
                    meets: { select: { id: true } },
                },
            });

            if (organizerExists) {
                currentUser = organizerExists;
                meets = currentUser.meets ? currentUser.meets.map((e) => e.id) : null;
                organization = false;
            } else {
                res.status(409).send({ error: "Email does not exist" });
                return;
            }
        }

        if (checkSimilar(currentUser.password, password)) {
            req.session.user = {
                id: currentUser.id,
                admin: organization,
                meets,
            };

            await req.session.save();
            res.status(200).send({ message: "Successfully logged in" });
        } else {
            res.status(409).send({ error: "Password is incorrect" });
        }
    }
)