import { useRef, useState } from "react";

export default function EditAttendance({ attendance, setEdit, endEdit, meet }) {
    const attendee = attendance;
    const [attended, setAttended] = useState(attendance.attendances[0].attended ? 'Attended' : 'Not Attended')
    const late = useRef(null);

    const editHandler = async (e) => {
        e.preventDefault();

        const data = {
            attendanceId: attendance.attendances[0].id,
            attendance: e.target.attendance.value,
            late: Number(e.target.late.value),
            trackAbsent: meet.trackAbsent
        };

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        await fetch('/api/update/attendance', options);
        endEdit();

    }

    const deleteRecord = async () => {
        await fetch('/api/delete/attendance?' + new URLSearchParams({ attendanceId: attendance.id }));
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

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <form className="modal-box" onSubmit={editHandler}>
                <h3 className="font-bold text-xl">Edit Attendance: {attendee.name}</h3>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Attendance</span>
                    </label>
                    <select className="select select-bordered" onChange={selectHandler} value={attended} name="attendance">
                        <option>Not Attended</option>
                        <option>Attended</option>
                    </select>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Submitted In (MIN)</span>
                    </label>
                    <input name="late" ref={late} onChange={lateHandler} type="number" placeholder="Type time" className="input input-bordered w-full" defaultValue={attendance.attendances[0].attended ? attendance.attendances[0].submitted : null} />
                </div>
                <div className="bg-base-200 p-2 rounded-lg text-xs mt-2">
                    *To mark as Tardy, put the submitted in time higher than the meet tardy time (if even enabled)
                </div>
                <div className="modal-action">
                    <button className="btn btn-error" type="button" onClick={deleteRecord}>Delete Record</button>
                    <button className="btn btn-success" type="submit">Edit</button>
                    <label className="btn btn-ghost" onClick={() => {
                        setEdit(null);
                    }}>Dismiss</label>
                </div>
            </form>
        </div>
    )
}