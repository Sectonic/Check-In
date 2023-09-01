import Link from "next/link";

export default function ViewAttendee({ view, setView }) {

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-xl">{view.name}'s Attendances</h3>
                <div className="mt-4 gap-4 flex flex-col justify-center items-center">
                    {view.attendances.map(attendance => (
                        <div className="p-4 border rounded-xl flex justify-between w-full">
                            <div>
                                <div className="font-bold">{attendance.event.name}</div>
                                <div className="mt-1 text-sm">Jan 5 2025 <span className="ml-1 badge badge-ghost">1:00 PM - 2:00 PM</span></div>
                            </div>
                            <div>
                                <Link className="btn btn-ghost" href={`/dashboard/${attendance.event.meet.id}/attendance?${new URLSearchParams({ eventId: attendance.eventId, search: view.specificId })}`}>Go To</Link>
                            </div>
                        </div>
                    ))}
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