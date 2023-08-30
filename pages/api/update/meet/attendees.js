import { ApiRoute } from "@/lib/config";
import db from "@/lib/prisma";

export default ApiRoute(
  async function handler(req, res) {
    if (req.method !== "POST") {
      res.status(504).send({ error: 'Only POST requests allowed' });
      return;
    }

    const user = req.session.user;
    if (!user || user.admin) {
      res.status(401).send({ error: 'An Organizer account is needed to access' });
      return;
    }

    const { inside, outside, meet } = req.body;

    const updatePromises = [];

    if (outside.length > 0) {
      updatePromises.push(
        Promise.all(outside.map(id => 
          db.attendee.update({
            where: { id },
            data: {
              meets: {
                disconnect: [{ id: Number(meet) }]
              }
            }
          })
        ))
      );
    }

    if (inside.length > 0) {
      updatePromises.push(
        Promise.all(inside.map(id => 
          db.attendee.update({
            where: { id },
            data: {
              meets: {
                connect: [{ id: Number(meet) }]
              }
            }
          })
        ))
      );
    }

    try {
      await Promise.all(updatePromises);
      res.status(200).end();
    } catch (error) {
      console.error('Error updating attendees:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
);