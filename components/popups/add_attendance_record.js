import { useEffect, useRef, useState } from "react";

export default function AddAttendanceRecord({ organizerId, setEdit, endEdit, meetId, event }) {
    const [attended, setAttended] = useState('Not Attended');
    const [attendees, setAttendees] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editting, setEditting] = useState(false);
    const [error, setError] = useState('');
    const late = useRef(null);

    const getAttendeesEvent = async () => {
        const attendeesReq = await fetch('/api/get/attendees_event?' + new URLSearchParams({ organizerId, meetId }));
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

        const currentAttendee = attendees.find(attendee => attendee.id === selectedAttendee);

        const data = {
            attendee: currentAttendee,
            event: event,
            attendance: e.target.attendance.value,
            late: Number(e.target.late.value),
        };

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        const response = await fetch('/api/post/attendance_record', options);
        if (response.ok) {
            endEdit();
        } else {
            const responseData = await response.json();
            setError(responseData.error);
        }
        setEditting(false);

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

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <form className="modal-box" onSubmit={editHandler}>
                <h3 className="font-bold text-xl">Batch Edit {event.name}</h3>
                <div className="mt-3 font-semibold text-lg">Select Attendee</div>
                { loading ? (
                    <div className="flex justify-center items-center py-5">
                        <div className='mx-auto' role="status">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mx-auto w-full form-control my-4">
                            <input name="search" type="text" placeholder="Search By Name/ID" className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="eventMenuScroll max-h-[400px] overflow-y-auto w-full flex flex-col gap-2">
                            {attendees.filter(attendee => (attendee.name.includes(search) || attendee.specificId.includes(search))).map((attendee, i) => (
                                <div className="form-control" key={i}>
                                    <label className="label cursor-pointer">
                                        <span className="label-text text-md font-semibold">{attendee.name} <span className="text-sm font-normal">- {attendee.specificId}</span></span> 
                                        <input type="radio" name="attendeeRadio" checked={selectedAttendee == attendee.id} className="radio radio-primary" onChange={() => setSelectedAttendee(attendee.id)} />
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
                { error.length > 0 && (
                    <div className="alert alert-error mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                { !loading && <div className="modal-action">
                    <button className="btn btn-success" type="submit">
                        { editting && <span className="loading loading-spinner"></span>}
                        Add
                    </button>
                    <label className="btn btn-ghost" onClick={() => {
                        setEdit(false);
                    }}>Dismiss</label>
                </div>}
            </form>
        </div>
    )
}