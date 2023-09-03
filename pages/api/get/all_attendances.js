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
    const allEvents = []
    meetAttends.forEach(meet => {

        meet.attendees.forEach(attendee => {
            const index = attendees.findIndex(obj => obj.id === attendee.id);
            if (index === -1) {
                attendees.push({...attendee, totalEvents: meet.events.length, totalHours: 0, eventsAttended: 0, attendances: 0, totalTimeSubmitted: 0, attendances: [], missed: []});
            } else {
                const currentAttendee = {...attendees[index]};
                attendees[index] = {...currentAttendee, totalEvents: currentAttendee.totalEvents + meet.events.length}
            }
        });
    
        meet.events.forEach(event => {

            const {attendances, ...eventWithoutAttendances} = event;

            allEvents.push(eventWithoutAttendances);

            event.attendances.forEach(attendance => {
                const index = attendees.findIndex(obj => obj.id === attendance.attendeeId);
                if (index !== -1) {
                    const attendee = {...attendees[index]};
                    attendees[index] = {
                        ...attendee, 
                        totalHours: attendee.totalHours + attendance.hours,
                        eventsAttended: attendee.eventsAttended + 1,
                        attendances: [...attendee.attendances, {...attendance, event: eventWithoutAttendances, meetId: meet.id, meetName: meet.name }],
                        totalTimeSubmitted: attendee.totalTimeSubmitted + attendance.submitted,
                    }
                }
            })
        })
        
    });

    meetAttends.forEach(meet => {
        const attendeesInMeet = meet.attendees.map(attendee => attendee.id);
        meet.events.forEach(event => {
            const {attendances, ...eventWithoutAttendances} = event;
            attendeesInMeet.forEach(attendeeInMeet => {
                const attended = event.attendances.map(attendance => attendance.attendeeId).includes(attendeeInMeet);
                if (!attended) {
                    const index = attendees.findIndex(obj => obj.id === attendeeInMeet);
                    const attendee = {...attendees[index]};
                    if (index !== -1) {

                        attendees[index] = {
                            ...attendee,
                            missed: [...attendee.missed, { event: eventWithoutAttendances, meetId: meet.id, meetName: meet.name, }]
                        }
                    }
                }
            })
        })
    });
    
    const transformedAttendees = attendees.map(attendee => {
        const { id, name, specificId, totalEvents, totalHours, eventsAttended, totalTimeSubmitted, attendances, missed } = attendee;
          
          return {
            id, name, specificId, eventsAttended, totalHours, attendances, missed,
            eventsNotAttended: totalEvents - eventsAttended,
            attendanceRate: parseFloat(((eventsAttended / totalEvents) * 100).toFixed(2)),
            avgTimeSubmitted: parseFloat(totalTimeSubmitted / eventsAttended || 0).toFixed(2),
          };
    });

    const sortedAttendees = transformedAttendees.sort((a, b) => {
        const combinedA = a.attendanceRate * 0.7 + a.totalHours * 0.3;
        const combinedB = b.attendanceRate * 0.7 + b.totalHours * 0.3;
        return combinedB - combinedA;
    });

    res.status(200).send({ sortedAttendees, allEvents });
}