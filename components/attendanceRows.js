
export const SingularAttendance = ({ attendee, setEdit, tardy }) => (
    <tr>
        <th>
            {attendee.name}
            <br/>
            <span className="text-[11px] font-normal">{attendee.specificId}</span>
        </th>
        <td>
            {attendee.submitted > (tardy || attendee.submitted + 1) ? (
            <span className={`badge badge-warning font-semibold`}>Tardy</span>
            ) : (
            <span className={`badge badge-success font-semibold`}>Present</span>
            )}
        </td>
        <td>{attendee.submitted}</td>
        <td><button onClick={() => setEdit(attendee)} className="btn btn-square btn-ghost"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg></button></td>
    </tr>
)

export const MultipleAttendance = ({ attendee, setMultipleEdit }) => (
    <tr>
        <th>
            {attendee.name}
            <br/>
            <span className="text-[11px] font-normal">{attendee.specificId}</span>
        </th>
        <td>
            <span className={`badge badge-success font-semibold mr-1`}>{attendee.attendances.length}</span>
            <span className={`badge badge-success font-semibold`}>Present</span>
        </td>
        <td>{attendee.attendances.map(att => att.submitted).join(', ')}</td>
        <td><button onClick={() => setMultipleEdit(attendee)} className="btn btn-square btn-ghost"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg></button></td>
    </tr>
)