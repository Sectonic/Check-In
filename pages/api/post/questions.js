import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";

export default ApiRoute(
    async function (req, res) {
        if (req.method !== "POST") {
            res.status(504).send({ error: 'Only POST requests allowed' });
            return;
        }
        const user = req.session.user;
        if (!user || !user.admin) {
            res.status(401).send({ error: 'A Organizer account is needed to access'});
            return;
        }
        const { questions } = req.body;
        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];
            if (question.id) {
                const {id, selections, ...data} = question;
                const updateOption = {
                        ...data,
                        order: (i + 1)
                };
                if (question.type == "select") {
                    await db.option.update({
                        where: {id},
                        data: {
                            selections: {
                                deleteMany: {}
                            }
                        }
                    });
                    updateOption.selections = {
                        create: selections.map(selection => {return {value: selection}})
                    };
                }
                await db.option.update({
                    where: {
                        id: id,
                    },
                    data: updateOption
                });
            } else {
                const {selections, ...data} = question;
                const newOption = {
                        ...data,
                        order: (i + 1)
                } ;
                if (question.type == "select") {
                    newOption.selections = {
                        create: selections.map(selection => {return {value: selection}})
                    };
                }
                await db.option.create({
                    data: newOption
                });
            }
        }
        res.status(200).send({message: 'Questions successfully updated'});
    }
)