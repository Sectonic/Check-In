import Link from "next/link";
import * as dayjs from 'dayjs';

export default function ViewAttendee({ view, setView }) {

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-xl">{view.name}'s Attendances</h3>
                <h4 className="font-semibold text-lg ml-1 mt-3">Participated Events</h4>
                <div className="mt-2 gap-4 flex flex-col justify-center items-center">
                    {view.eventsAttended.map((attendance, i) => (
                        <div className="p-4 border rounded-xl flex justify-between w-full" key={i}>
                            <div>
                                <div className="font-bold">{attendance.name} ({attendance.meet.name})</div>
                                <div className="mt-1 text-sm">{dayjs.unix(attendance.startTime).format('MMM D YYYY')} <span className="ml-1 badge badge-ghost">{dayjs.unix(attendance.startTime).format('h:mm A')} - {dayjs.unix(attendance.endTime).format('h:mm A')}</span></div>
                            </div>
                            <div>
                                <Link className="btn btn-ghost" href={`/dashboard/${attendance.meet.id}/attendance?${new URLSearchParams({ eventId: attendance.id, search: view.specificId })}`}>Go To</Link>
                            </div>
                        </div>
                    ))}
                    { view.eventsAttended.length === 0 && <div className="p-4 border rounded-xl w-full text-center">None</div> }
                </div>
                <h4 className="font-semibold text-lg ml-1 mt-3">Missed Events</h4>
                <div className="mt-2 gap-4 flex flex-col justify-center items-center">
                    {view.missed.map((attendance, i) => (
                            <div className="p-4 border rounded-xl flex justify-between w-full" key={i}>
                                <div>
                                    <div className="font-bold">{attendance.name} ({attendance.meet.name})</div>
                                    <div className="mt-1 text-sm">{dayjs.unix(attendance.startTime).format('MMM D YYYY')} <span className="ml-1 badge badge-ghost">{dayjs.unix(attendance.startTime).format('h:mm A')} - {dayjs.unix(attendance.endTime).format('h:mm A')}</span></div>
                                </div>
                                <div>
                                    <Link className="btn btn-ghost" href={`/dashboard/${attendance.meet.id}/attendance?${new URLSearchParams({ eventId: attendance.id, search: view.specificId })}`}>Go To</Link>
                                </div>
                            </div>
                    ))}
                    { view.missed.length === 0 && <div className="p-4 border rounded-xl w-full text-center">None</div> }
                </div>
                <div className="modal-action">
                    <label className="btn btn-ghost" onClick={() => {
                        setView({});
                    }}>Dismiss</label>
                </div>
            </div>
        </div>
    )
}