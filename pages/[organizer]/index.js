import ViewAttendee from "@/components/popups/view_attendee";
import db from "@/lib/prisma";
import { useState } from "react";

export const getServerSideProps = async ({ params }) => {
    const organizerId = Number(params.organizer);

    if (Number.isNaN(organizerId))
      return { redirect: { destination: '/', permanent: false } };
  
    const organizer = await db.organizer.findUnique({
      where: { id: organizerId },
      include: { meets: true }
    });
  
    if (!organizer)
      return { redirect: { destination: '/', permanent: false } };
  
    const meetIds = organizer.meets.map(meet => meet.id);

    const meetAttends = await db.meet.findMany({
      where: { id: { in: meetIds } },
      select: {
        id: true,
        events: {
          include: {
            attendances: true
          }
        },
        attendees: { select: { id: true, specificId: true, name: true } }
      }
    });

    const attendees = [];
    meetAttends.forEach(meet => {
      
      meet.attendees.forEach(attendee => {
        const index = attendees.findIndex(obj => obj.id === attendee.id);
        if (index === -1) {
          attendees.push({...attendee, totalEvents: meet.events.length, totalHours: 0, eventsAttended: 0, attendances: 0, totalTimeSubmitted: 0, attendances: []});
        } else {
          const currentAttendee = {...attendees[index]};
          attendees[index] = {...currentAttendee, totalEvents: currentAttendee.totalEvents + meet.events.length}
        }
      });

      meet.events.forEach(event => {
        event.attendances.forEach(attendance => {
          const index = attendees.findIndex(obj => obj.id === attendance.attendeeId);
          if (index !== -1) {
            const attendee = {...attendees[index]};
            const {attendances, ...eventWithoutAttendances} = event;
            attendees[index] = {
              ...attendee, 
              totalHours: attendee.totalHours + attendance.hours,
              eventsAttended: attendee.eventsAttended + 1,
              attendances: [...attendee.attendances, {...attendance, event: eventWithoutAttendances, meetId: meet.id}],
              totalTimeSubmitted: attendee.totalTimeSubmitted + attendance.submitted,
            }
          }
        })
      })
      
    })
  
    const transformedAttendees = attendees.map(attendee => {
      const { id, name, specificId, totalEvents, totalHours, eventsAttended, totalTimeSubmitted, attendances } = attendee;
        
        return {
          id, name, specificId, eventsAttended, totalHours, attendances,
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
    
    return {
        props: { organizer, attendees: sortedAttendees }
    };
}

export default function Organizer({ organizer, attendees }) {
  const [view, setView] = useState({});

  return (
    <div className="mx-auto max-w-[1700px]">
        { Object.keys(view).length !== 0 && <ViewAttendee view={view} setView={setView} /> }
        <h1 className="text-2xl font-semibold max-sm:text-center">{organizer.name}'s Attendee Only List</h1>
        <div className="overflow-x-auto">
            <table className="table w-full rounded-none">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Attendance %</th>
                    <th>Avg Submitted (min)</th>
                    <th>Attended</th>
                    <th>Not Attended</th>
                    <th>Hours</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {attendees.map((row, i) => (
                    <tr key={i}>
                        <th>
                            {row.name}
                            <br/>
                            <span className="text-[11px] font-normal">{row.specificId}</span>
                        </th>
                        <td>{row.attendanceRate}%</td>
                        <td>{row.avgTimeSubmitted}</td>
                        <td>{row.eventsAttended}</td>
                        <td>{row.eventsNotAttended}</td>
                        <td>{row.totalHours}</td>
                        <td><button type="button" className="btn btn-square btn-ghost" onClick={() => setView(row)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg></button></td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
  )
}