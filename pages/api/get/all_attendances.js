import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { meetIds, search, startTime, endTime } = req.query;

    const attendances = await db.attendance.findMany({
        where: {
          event: {
            meet: {
              id: { in: meetIds.split(',').map(id => Number(id)) }
            },
            startTime: { gte: Number(startTime) },
            endTime: { lt: Number(endTime) }
          },
          attendee: {
            OR: [{ name: { contains: search } }, { specificId: { contains: search } }]
          }
        },
        include: {
            event: {
              include: {
                meet: true
              }
            }
        }
    });

    const allEvents = await db.event.findMany({
        where: {
            meet: {
                id: { in: meetIds.split(',').map(id => Number(id)) }
            },
            startTime: { gte: Number(startTime) },
            endTime: { lt: Number(endTime) }
        }
    })
  
    const attendees = {};
    attendances.forEach(attendance => {
        const { id, name, specificId, hours, submitted, attended, event } = attendance;

        if (!attendees[specificId]) {
            attendees[specificId] = {
                id, name,
                totalHours: 0,
                totalSubmitted: 0,
                totalEvents: 0,
                eventsAttended: [],
                missed: []
            };
        }

        if (attended) {
            attendees[specificId].totalHours += hours;
            attendees[specificId].eventsAttended.push(event);
        } else {
            attendees[specificId].missed.push(event);
        }

        attendees[specificId].totalSubmitted += submitted
        attendees[specificId].totalEvents += 1

    })
    
    const transformedAttendees = Object.entries(attendees).map(([specificId, attendee]) => {
        const { id, name, totalEvents, totalHours, eventsAttended, totalSubmitted, missed } = attendee;
        
        return {
            specificId,
            id,
            name,
            eventsAttended,
            missed,
            totalHours: parseFloat(totalHours).toFixed(2),
            eventsNotAttended: totalEvents - eventsAttended.length,
            attendanceRate: parseFloat(((eventsAttended.length / totalEvents) * 100).toFixed(2)),
            avgTimeSubmitted: parseFloat(totalSubmitted / eventsAttended.length || 0).toFixed(2),
        };
    });

    res.status(200).send({ sortedAttendees: transformedAttendees, allEvents });
}