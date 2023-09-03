import db from "@/lib/prisma";

export default async function handler(req, res) {
    const { meetIds, search, startTime, endTime } = req.query;

    const meetAttends = await db.meet.findMany({
        where: { id: { in: meetIds.split(',').map(id => Number(id)) } },
        select: {
            id: true,
            name: true,
            events: {
                where: {
                    startTime: { gte: Number(startTime) },
                    endTime: { lt: Number(endTime) }
                },
                include: {
                    attendances: true
                }
            },
            attendees: { 
                where: { OR: [{ name: { contains: search } }, { specificId: { contains: search } }] },
                select: { id: true, specificId: true, name: true } 
            }
        }
    });
  
    const attendees = [];
    const allEvents = [];
    meetAttends.forEach(meet => {

        meet.attendees.forEach(attendee => {
            const index = attendees.findIndex(obj => obj.id === attendee.id);
            if (index === -1) {
                attendees.push({
                    ...attendee, 
                    inMeets: [meet.id],
                    totalEvents: meet.events.length, 
                    totalHours: 0, 
                    eventsAttended: 0, 
                    attendances: 0, 
                    totalTimeSubmitted: 0, 
                    attendances: [], 
                    missed: []
                });
            } else {
                const indexedAttendee = {...attendees[index]}
                attendees[index] = {
                    ...indexedAttendee, inMeets: [...indexedAttendee.inMeets, meet.id]
                }
            }
        });
        
    });

    meetAttends.forEach(meet => {
        meet.events.forEach(event => {

            const {attendances, ...eventWithoutAttendances} = event;
            allEvents.push(eventWithoutAttendances);

            event.attendances.forEach(attendance => {

                const index = attendees.findIndex(obj => obj.id === attendance.attendeeId);
                if (index !== -1 && attendees[index].inMeets.includes(meet.id)) {
                    const attendee = {...attendees[index]};
                    
                    const eventAttendances = attendance.attended ? ({
                        attendances: [...attendee.attendances, {...attendance, event: eventWithoutAttendances, meetId: meet.id, meetName: meet.name }],
                        missed: attendee.missed,
                        eventsAttended: attendee.eventsAttended + 1,
                        totalHours: attendee.totalHours + attendance.hours,
                        totalTimeSubmitted: attendee.totalTimeSubmitted + attendance.submitted,
                    }) : ({
                        missed: [...attendee.missed, { event: eventWithoutAttendances, meetId: meet.id, meetName: meet.name, }],
                        attendances: attendee.attendances,
                        eventsNotAttended: attendee.eventsNotAttended + 1,
                    });
                    
                    attendees[index] = {
                        ...attendee, ...eventAttendances, 
                    }
                }
            })
        })
    })
    
    const transformedAttendees = attendees.map(attendee => {
        const { id, name, specificId, totalEvents, totalHours, eventsAttended, totalTimeSubmitted, attendances, missed } = attendee;
          
          return {
            id, name, specificId, eventsAttended, attendances, missed,
            totalHours: parseFloat(totalHours).toFixed(2),
            eventsNotAttended: totalEvents - eventsAttended,
            attendanceRate: parseFloat(((eventsAttended / totalEvents) * 100).toFixed(2)),
            avgTimeSubmitted: parseFloat(totalTimeSubmitted / eventsAttended || 0).toFixed(2),
          };
    });

    res.status(200).send({ sortedAttendees: transformedAttendees, allEvents });
}