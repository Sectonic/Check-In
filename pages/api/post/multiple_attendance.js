import db from "@/lib/prisma";
import { ApiRoute } from "@/lib/config";

export default ApiRoute(async function (req, res) {
  
  if (req.method !== "POST") {
    res.status(504).send({ message: 'Only POST requests allowed' });
    return;
  }

  const user = req.session.user;
  if (!user || user.admin) {
    res.status(401).send({ message: 'An Organizer account is needed to access' });
    return;
  }

  const { deletedAttendanceIds, modifiedAttendances, newAttendances } = req.body;

  const transactions = [];

  transactions.push(
    db.attendance.deleteMany({
        where: { id: { in: deletedAttendanceIds } }
    })
  );

  for (var i = 0; i < modifiedAttendances.length; i++) {
    const modifiedAttendance = modifiedAttendances[i];

    transactions.push(
        db.attendance.update({
            where: { id: modifiedAttendance.id },
            data: {
                submitted: modifiedAttendance.submitted
            }
        })
    );

  }

  transactions.push(
    db.attendance.createMany({
        data: newAttendances
    }) 
  );

  await db.$transaction(transactions);

  res.status(200).end();
});