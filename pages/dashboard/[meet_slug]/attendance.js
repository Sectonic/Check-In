import EventPicker from "@/components/event_picker";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import * as dayjs from 'dayjs';
import EditAttendance from "@/components/popups/edit_attendance";
import io from 'socket.io-client';
import CreateEvent from "@/components/popups/create_event";
var socket;

export default function Attendance({ currentMeet }) {
  const router = useRouter();
  const [searchValue, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notAttended, setNotAttended] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [edit, setEdit] = useState(null);
  const [create, setCreate] = useState(false);
  const [includeAbsent, setIncludeAbsent] = useState(true);
  const [value, setValue] = useState({ 
    startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'), 
    endDate:  dayjs().add(1, 'day').format('YYYY-MM-DD')
  });
  const roomId = 'meet-' + currentMeet.id;
  const dropdown = useRef(null);
  

  const searchHandler = (e) => {
    e.preventDefault();
    const { meet_slug, ...searchParams } = router.query;
    const params = new URLSearchParams(searchParams);
    params.set('search', e.target.search.value || '');
    router.push('/dashboard/' + currentMeet.id + '/attendance?' + params, undefined, { shallow: true });
  }

  const eventHandler = (eventId) => {
    const { meet_slug, ...searchParams } = router.query;
    const params = new URLSearchParams(searchParams);
    params.set('eventId', eventId === currentEvent?.id ? '' : eventId);
    router.push('/dashboard/' + currentMeet.id + '/attendance?' + params, undefined, { shallow: true });
  }

  const getAttendanceData = async () => {
    const attendanceDict = { 
      search: router.query.search || '', 
      eventId: router.query.eventId, 
      meetId: currentMeet.id, 
      startTime: dayjs(value.startDate).unix(), 
      endTime:  dayjs(value.endDate).unix() 
    }
    const attendanceReq = await fetch('/api/get/attendance?' + new  URLSearchParams(attendanceDict));
    const attendanceData = await attendanceReq.json();
    setFutureEvents(attendanceData.futureEvents);
    setEvents(attendanceData.events);
    setAttendance(attendanceData.attendance);
    setNotAttended(attendanceData.notAttended);
    setCurrentEvent(attendanceData.currentEvent);
    if (attendanceData.newStartTime) {
      setValue({ startDate: attendanceData.newStartTime, endDate: value.endDate });
    }
  }

  const outsideHandler = () => {
    dropdown.current.className = "dropdown min-w-max";
  }

  const endEdit = () => {
    setEdit(null);
    getAttendanceData();
  }

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      socket.emit('join-room', roomId);
    });

    socket.on('attendance-updated', newAttendance => {
      setAttendance(prev => [...prev, newAttendance]);
      setNotAttended(prev => prev.filter(e => e.id !== newAttendance.id));
    })
  }

  useEffect(() => {
    const params = new URLSearchParams({ search: '', eventId: ''})
    if (!router.query.eventId) {
      router.push('/dashboard/' + currentMeet.id + '/attendance?' + params), undefined, { shallow: true };
    }
    socketInitializer();

    return () => {
      socket.disconnect();
    };
  }, [router.isReady]);

  useEffect(() => {
    getAttendanceData();
    setSearch(router.query.search || '');
  }, [router.query.search, router.query.eventId])

  return (
      <>  
        { edit && <EditAttendance setEdit={setEdit} attendance={edit} endEdit={endEdit} currentEvent={currentEvent}  /> }
        { create && <CreateEvent setCreate={setCreate} currentMeet={currentMeet} fetchMeets={() => console.log('fetch')} /> }
        <div className="flex justify-start items-end gap-5">
          <h1 className="text-2xl font-semibold">{currentMeet.name} Attendance Sheet</h1>
          { !currentMeet.reoccurance && <div className="btn btn-success btn-sm font-semibold" onClick={() => setCreate(true) } >Add New Event</div>}
        </div>
        <div className="p-2 mt-3 mb-2 flex max-sm:justify-between gap-3 bg-base-200 rounded-lg">
          <div className="dropdown min-w-max" ref={dropdown}>
            {currentEvent || futureEvents.length !== 0 ? (
              <>
                <label tabIndex={0} className="btn btn-ghost" onClick={() => {dropdown.current.className = "dropdown dropdown-open min-w-max"}}>
                  {currentEvent?.name || 'No Attendance'}
                  <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                </label>
                <OutsideClickHandler onOutsideClick={outsideHandler}>
                  <ul tabIndex={0} className="flex-col dropdown-content menu p-2 shadow bg-base-100 rounded-box w-[280px] gap-2 z-20">
                    <EventPicker 
                      currentMeet={currentMeet} 
                      setEvents={setEvents} 
                      currentEvent={currentEvent} 
                      events={events} 
                      futureEvents={futureEvents}
                      eventHandler={eventHandler} 
                      value={value}
                      setValue={setValue}
                    />
                  </ul>
                </OutsideClickHandler>
              </>
            ) : (
              <div className="btn btn-ghost">No Attendance</div>
            )}
          </div>
          <div className="max-sm:hidden form-control w-full">
            <form className="input-group" onSubmit={searchHandler}>
              <input name="search" type="text" placeholder="Search Name/ID" className="input input-bordered w-full" defaultValue={searchValue} />
              <button className="btn btn-square btn-primary" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
          </div>
          <div className="dropdown dropdown-end w-max">
            <label tabIndex={0} className="btn btn-ghost ">Filters</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <div className="form-control p-2">
                <label className="cursor-pointer label">
                  <span className="label-text">Include Absent</span> 
                  <input type="checkbox" className="toggle toggle-primary" checked={includeAbsent} onChange={(e) => setIncludeAbsent(e.target.checked)} />
                </label>
              </div>
            </ul>
          </div>
        </div>
        <div className="sm:hidden form-control w-full mb-3 mt-1">
          <form className="input-group" onSubmit={searchHandler}>
            <input name="search" type="text" placeholder="Search Name/ID" className="input input-bordered w-full" defaultValue={searchValue} />
            <button className="btn btn-square btn-primary" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>
        { currentEvent && !currentMeet.reoccurance && (
          <div className="mb-2 ml-2">
            <div className="inline font-semibold">{dayjs.unix(currentEvent.startTime).format('YYYY-MM-DD')}: </div>
            <div className="inline badge badge-ghost ml-1 font-semibold">{dayjs.unix(currentEvent.startTime).format('hh:mm A')} - {dayjs.unix(currentEvent.endTime).format('hh:mm A')}</div>
          </div>
        ) }

        <div className="overflow-x-auto">
          <table className="table w-full rounded-none">
            <thead>
              <tr>
                <th>Name</th>
                <th>Attendance</th>
                <th>Submitted In (min)</th>
                {/* <th>What's your favorite color?</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>

              {attendance.map(row => (
                <tr>
                  <th>
                    {row.attendee.name}
                    <br/>
                    <span className="text-[11px] font-normal">{row.attendee.specificId}</span>
                  </th>
                  <td>
                    {row.submitted > 5 ? (
                      <span className={`badge badge-warning font-semibold`}>Tardy</span>
                    ) : (
                      <span className={`badge badge-success font-semibold`}>Present</span>
                    )}
                  </td>
                  <td>{row.submitted}</td>
                  {/* <td>Purple</td> */}
                  <td><button onClick={() => setEdit(row)} className="btn btn-square btn-ghost"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg></button></td>
                </tr>
              ))}
              {includeAbsent && notAttended.map(row => (
                <tr>
                  <th>
                    {row.name}
                    <br/>
                    <span className="text-[11px] font-normal">{row.specificId}</span>
                  </th>
                  <td><span className="badge badge-error font-semibold">Absent</span></td>
                  <td>--</td>
                  {/* <td>Purple</td> */}
                  <td><button onClick={() => setEdit(row)} className="btn btn-square btn-ghost"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
  )
}
