import { useEffect, useRef, useState } from "react";

export default function BatchEditAttendance({ organizerId, event, setEdit, endEdit, meetId }) {
    const [attended, setAttended] = useState('Not Attended');
    const [attendees, setAttendees] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editting, setEditting] = useState(false);
    const late = useRef(null);

    const getAttendeesEvent = async () => {
        const attendeesReq = await fetch('/api/get/attendees_event?' + new URLSearchParams({ eventId: event.id, organizerId, meetId }));
        const attendeesData = await attendeesReq.json();
        setAttendees(attendeesData.attendees);
        setLoading(false);
    }

    useEffect(() => {
        getAttendeesEvent();
    }, [])

    const editHandler = async (e) => {
        e.preventDefault();
        setEditting(true);

        const data = {
            attendees: attendees.filter(attendee => selectedAttendees.includes(attendee.id)),
            attendance: e.target.attendance.value,
            late: Number(e.target.late.value),
        };

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        await fetch('/api/update/batch_attendance', options);
        setEditting(false);
        endEdit();

    }

    const selectHandler = (e) => {
        setAttended(e.target.value);
        if (e.target.value === 'Attended' && !late.current.value) {
            late.current.value = 0;
        } else if (e.target.value === 'Not Attended' && late.current.value) {
            late.current.value = null;
        }
    }

    const lateHandler = (e) => {
        if (e.target.value && attended === 'Not Attended') {
            late.current.value = null;
        } else if (!e.target.value && attended === 'Attended') {
            late.current.value = 0;
        } else if (e.target.value.length === 2 && e.target.value[0] === '0' && attended === 'Attended') {
            late.current.value = e.target.value[1];
        }
    }

    const selectedAttendeesChange = (e, attendeeId) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedAttendees(prev => [...prev, attendeeId]);
        } else {
            setSelectedAttendees(prev => prev.filter(i => i !== attendeeId));
        }
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <form className="modal-box" onSubmit={editHandler}>
                <h3 className="font-bold text-xl">Batch Edit {event.name}</h3>
                <div className="mt-3 font-semibold text-lg">Select Attendees</div>
                { loading ? (
                    <div className="flex justify-center items-center py-5">
                        <div className='mx-auto' role="status">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="my-2 flex justify-start gap-2">
                            <div className="btn btn-success btn-sm" onClick={() => setSelectedAttendees(attendees.map(attendee => attendee.id))}>Select All</div>
                            <div className="btn btn-error btn-sm" onClick={() => setSelectedAttendees([])}>Deselect All</div>
                        </div>
                        <div className="mx-auto w-full form-control my-4">
                            <input name="search" type="text" placeholder="Search By Name/ID" className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="eventMenuScroll max-h-[400px] overflow-y-auto w-full flex flex-col gap-2">
                            {attendees.filter(attendee => (attendee.name.includes(search) || attendee.specificId.includes(search))).map((attendee, i) => (
                                <div className="form-control" key={i}>
                                    <label className="label cursor-pointer">
                                        <span className="label-text text-md font-semibold">{attendee.name} <span className="text-sm font-normal">- {attendee.specificId}</span></span> 
                                        <input type="checkbox" checked={selectedAttendees.includes(attendee.id)} className="checkbox checkbox-primary" onChange={(e) => selectedAttendeesChange(e, attendee.id)} />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Attendance</span>
                    </label>
                    <select className="select select-bordered" onChange={selectHandler} name="attendance" value={attended}>
                        <option>Not Attended</option>
                        <option>Attended</option>
                    </select>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Submitted In (MIN)</span>
                    </label>
                    <input name="late" ref={late} onChange={lateHandler} type="number" placeholder="Type time" className="input input-bordered w-full" />
                </div>
                <div className="bg-base-200 p-2 rounded-lg text-xs mt-2">
                    *To mark as Tardy, put the submitted in time higher than the meet tardy time (if even enabled)
                </div>
                { !loading && <div className="modal-action">
                    <button className="btn btn-success" type="submit">
                        { editting && <span className="loading loading-spinner"></span>}
                        Edit
                    </button>
                    <label className="btn btn-ghost" onClick={() => {
                        setEdit(false);
                    }}>Dismiss</label>
                </div>}
            </form>
        </div>
    )
}