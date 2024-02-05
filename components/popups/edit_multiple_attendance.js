import { useRef, useState } from "react";
import * as dayjs from 'dayjs';

const PopupAttendanceRow = ({ setAttendances, attendance, index }) => {

    const editHandler = async (e) => 
        setAttendances(prev => {
            const modifiedAttendance = { ...prev[index] };

            modifiedAttendance.submitted = Number(e.target.value) === NaN ? 0 : Number(e.target.value);
            
            const newAttendances = [...prev];
            newAttendances[index] = modifiedAttendance;
            
            return newAttendances;
        });

    const deleteRecord = async () => setAttendances(prev => prev.filter((_, i) => i != index));

    return (
        <div role="alert" className="flex justify-between alert mt-3">
            <span>Submitted at: <input onChange={editHandler} type="text" value={attendance.submitted} className="p-1 input max-w-[50px] mx-1 text-center" /> mins</span>
            <div className="flex gap-2">
                <button className="btn btn-sm btn-error" onClick={deleteRecord}>Delete</button>
            </div>
        </div>
    )
}

export default function EditMultipleAttendance({ event, attendee, setMultipleEdit, endEdit }) {
    const [attendances, setAttendances] = useState(attendee.attendances);
    const [newAttendances, setNewAttendances] = useState([]);
    const late = useRef(null);

    const saveAttendance = async () => {

        const deletedAttendanceIds = attendee.attendances.map(att => att.id).filter(attendanceId => !attendances.map(att => att.id).includes(attendanceId));

        var hours = dayjs.unix(event.endTime).diff(dayjs.unix(event.startTime), 'hour');
        if (hours === 0) {
            hours = dayjs.unix(event.endTime).diff(dayjs.unix(event.startTime), 'minute') / 60;
        }
        
        const data = {
            deletedAttendanceIds,
            modifiedAttendances: attendances.map(att => ({ id: att.id, submitted: att.submitted })),
            newAttendances: newAttendances.map(att => ({ ...att, attendeeId: attendee.id, name: attendee.name, specificId: attendee.specificId, attended: true, eventId: event.id, hours: Math.round(hours * 100) / 100 }))
        }

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        await fetch('/api/post/multiple_attendance', options);
        endEdit();

    }

    const addAttendance = async () => {
        setNewAttendances(prev => [...prev, { submitted: 0 }]);
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-xl">Edit Attendances: {attendee.name}</h3>
                <div className="bg-base-200 p-2 rounded-lg text-xs mt-2">
                    *To mark as Tardy, put the submitted in time higher than the meet tardy time (if even enabled)
                </div>
                { 
                    attendances.map((attendance, i) => <PopupAttendanceRow key={i} setAttendances={setAttendances} attendance={attendance} index={i} />)
                }
                { 
                    newAttendances.map((attendance, i) => <PopupAttendanceRow key={i} setAttendances={setNewAttendances} attendance={attendance} index={i} />)
                }
                <div className="flex flex-start mt-3">
                    <div className="btn btn-primary btn-sm" onClick={addAttendance}>Add Attendance</div>
                </div>
                <div className="modal-action">
                    <button className="btn btn-success" type="submit" onClick={() => saveAttendance()}>Save</button>
                    <label className="btn btn-ghost" onClick={() => {
                        setMultipleEdit(null);
                    }}>Dismiss</label>
                </div>
            </div>
        </div>
    )
}