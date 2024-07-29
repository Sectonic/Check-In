import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";
import { checkSimilar } from '@/lib/crypt';

export default ApiRoute(
    async function handler(req, res) {
        const { email, password } = req.query;

        const organizerExists = await db.organizer.findFirst({
            where: { email },
            select: {
                id: true,
                password: true,
                meets: { select: { id: true } },
            },
        });

        if (!organizerExists) {
            res.status(409).send({ error: "Email does not exist" });
            return;
        }

        const currentUser = organizerExists;
        const meets = currentUser.meets ? currentUser.meets.map((e) => e.id) : null;

        if (checkSimilar(currentUser.password, password)) {
            req.session.user = {
                id: currentUser.id,
                meets,
            };

            await req.session.save();
            res.status(200).send({ message: "Successfully logged in" });
        } else {
            res.status(409).send({ error: "Password is incorrect" });
        }
    }
)