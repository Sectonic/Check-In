import ViewAttendee from "@/components/popups/view_attendee";
import db from "@/lib/prisma";
import { useEffect, useState, useRef } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import * as dayjs from 'dayjs';
import Datepicker from "react-tailwindcss-datepicker";
import { SsrRoute } from "@/lib/config";
import ExportCSV from "@/components/popups/exportCsv";

export const getServerSideProps = SsrRoute(
    async ({ req, params }) => {
      const organizerId = Number(params.organizer);

      if (Number.isNaN(organizerId))
        return { redirect: { destination: '/', permanent: false } };
    
      const organizer = await db.organizer.findUnique({
        where: { id: organizerId },
        include: { meets: true }
      });
    
      if (!organizer)
        return { redirect: { destination: '/', permanent: false } };
      
      return {
          props: { organizer, currentOrganizer: req.session.user ? (req.session.user.id === organizerId) : false }
      };
  }
)

export default function Organizer({ organizer, currentOrganizer }) {
  const [csvExport, setCsvExport] = useState(false);
  const [csvExportFilters, setCsvExportFilters] = useState({attendance: true, submitted: true, attended: true, notAttended: true, hours: true, events: true});
  const [csvExportData, setCsvExportData] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [selectedMeets, setSelectedMeets] = useState(organizer.meets.map(meet => meet.id));
  const [allEvents, setAllEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState({});
  const [value, setValue] = useState({ 
    startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'), 
    endDate:  dayjs().add(1, 'day').format('YYYY-MM-DD')
  });
  const dropdown = useRef(null);

  const getAttendees = async () => {
    const req = await fetch('/api/get/all_attendances?' + new URLSearchParams({ search, meetIds: selectedMeets, startTime: dayjs(value.startDate).unix(), endTime: dayjs(value.endDate).unix() }));
    const data = await req.json();
    setAttendees(data.sortedAttendees);
    setAllEvents(data.allEvents);
    setLoading(false);
  }

  const exportHandler = () => {

    const allCheckNames = {attendance: 'Attendance Rate (%)', submitted: 'Average Time Submitted (min)', attended: 'Events Attended', notAttended: 'Events Missed', hours: 'Total Hours'};
    const csvAttendees = [['Last Name', 'First Name', 'ID']];

    Object.keys(allCheckNames).forEach(key => {
      const value = allCheckNames[key];
      if (csvExportFilters[key]) {
        csvAttendees[0].push(value);
      }
    })

    if (csvExportFilters.events) {
      allEvents.forEach(event => {
        csvAttendees[0].push(event.name);
      });
    } 

    attendees.forEach(attendee => {

      const splitName = attendee.name.split(' ').map(name => name.trim());
      const firstName = splitName[0];
      const lastName = splitName.slice(1).join(' ');
      const allCheckNames = {attendance: attendee.attendanceRate, submitted: attendee.avgTimeSubmitted, attended: attendee.eventsAttended, notAttended: attendee.eventsNotAttended, hours: attendee.totalHours};
      const attendeeInfo = [lastName, firstName, attendee.specificId];

      Object.keys(allCheckNames).forEach(key => {
        const value = allCheckNames[key];
        if (csvExportFilters[key]) {
          attendeeInfo.push(value);
        }
      })

      if (csvExportFilters.events) {
        allEvents.forEach(event => {

          var recorded = false;
  
          attendee.attendances.forEach(attendance => {
            if (event.id === attendance.event.id) {
              attendeeInfo.push('Attended');
              recorded = true;
            }
          });
  
          attendee.missed.forEach(missingAttendance => {
            if (event.id === missingAttendance.event.id) {
              attendeeInfo.push('Not Attended');  
              recorded = true;
            }
          });
  
          if (!recorded) {
            attendeeInfo.push('Not Attended');
          }
  
        }); 
      }

      csvAttendees.push(attendeeInfo);
    });
    
    setCsvExportData(csvAttendees);
  }

  useEffect(() => {
    exportHandler();
  }, [csvExportFilters])

  useEffect(() => {
    getAttendees();
  }, []);

  useEffect(() => {
    getAttendees();
  }, [selectedMeets, value])

  const meetChange = (e, meetId) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedMeets(prev => [...prev, meetId]);
    } else {
      setSelectedMeets(prev => prev.filter(i => i !== meetId));
    }
  }

  const outsideHandler = () => {
    dropdown.current.className = "dropdown min-w-max";
  }

  const searchHandler = (e) => {
    e.preventDefault();
    getAttendees();
  }

  const handleValueChange = (newValue) => {
    setValue(newValue); 
  } 

  return (
    <div className="mx-auto max-w-[1700px]">
        { Object.keys(view).length !== 0 && <ViewAttendee view={view} setView={setView} /> }
        { csvExport && (
          <ExportCSV 
            setCsvExport={setCsvExport} 
            exportHandler={exportHandler} 
            csvExportFilters={csvExportFilters} 
            setCsvExportFilters={setCsvExportFilters} 
            csvExportData={csvExportData} 
          />
        ) }
        <h1 className="text-2xl font-semibold max-sm:text-center">{organizer.name}'s Attendee Only List </h1>
        { currentOrganizer && <div className="mt-3 btn btn-success btn-sm" onClick={() => setCsvExport(true)}>Export as CSV</div> }
        <div className="p-2 mt-3 mb-2 flex max-sm:justify-between gap-3 bg-base-200 rounded-lg">
          <div className="dropdown min-w-max" ref={dropdown}>
              <label tabIndex={0} className="btn btn-ghost" onClick={() => {dropdown.current.className = "dropdown dropdown-open min-w-max"}}>
                Options
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
              </label>
              <OutsideClickHandler onOutsideClick={outsideHandler}>
                <ul tabIndex={0} className="flex-col dropdown-content menu p-5 shadow bg-base-100 rounded-box w-[280px] gap-2 z-20">
                  <div className="text-sm font-bold -mb-2">Events Timeframe:</div>
                  <Datepicker 
                    inputClassName="relative transition-all outline-0 ring-0 duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                    value={value} 
                    onChange={handleValueChange} 
                    showFooter={true} 
                    showShortcuts={true} 
                    readOnly={true} 
                    popoverDirection="down"
                  /> 
                  <div className="text-sm font-bold -mb-2">Include Meets:</div>
                  <div className="eventMenuScroll max-h-52 overflow-y-auto w-full">
                    {organizer.meets.map((meet, i) => (
                      <div className="form-control" key={i}>
                        <label className="label cursor-pointer">
                          <span className="label-text text-md font-semibold">{meet.name}</span> 
                          <input type="checkbox" checked={selectedMeets.includes(meet.id)} className="checkbox checkbox-primary" onChange={(e) => meetChange(e, meet.id)} />
                        </label>
                      </div>
                    ))}
                  </div>
                </ul>
              </OutsideClickHandler>
          </div>
          <div className="form-control w-full">
            <form className="input-group" onSubmit={searchHandler}>
              <input name="search" type="text" placeholder="Search Name/ID" className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-square btn-primary" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
          </div>
        </div>
        { loading ? (
            <div className='flex justify-center items-center h-[calc(100vh-330px)]'>
              <div className='mx-auto' role="status">
                <span className="loading loading-dots loading-md"></span>
              </div>
            </div>
        ) : (
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
        )}
    </div>
  )
}