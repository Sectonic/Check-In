import * as dayjs from 'dayjs';

export default function AttendanceEventPicker({ cancelEventPicking, inTimeEvents = [], reoccurringMeets = [], getResult, eventPickingId, previousManual, setManual }) {

    const convertTimeDict = (dictString) => {
        const dict = JSON.parse(dictString);
        return dayjs().set('hour', dict.hour).set('minute', dict.minute).set('second', 0);
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-xl">Pick Ongoing Event</h3>
                <div className="mt-2 gap-4 flex flex-col justify-center items-center">
                    {inTimeEvents.map((event, i) => (
                        <div className="transition cursor-pointer hover:bg-primary-content/40 p-4 border rounded-xl flex justify-between w-full" key={i} onClick={() => {
                            getResult(eventPickingId, event.meet.id, true);
                            cancelEventPicking(true);
                        }}>
                            <div>
                                <div className="font-bold">{event.meet.reoccurance ? `${event.meet.scope} Event` : event.name} ({event.meet.name})</div>
                                <div className="mt-1 text-sm">{dayjs.unix(event.startTime).format('MMM D YYYY')} <span className="ml-1 badge badge-ghost">{dayjs.unix(event.startTime).format('h:mm A')} - {dayjs.unix(event.endTime).format('h:mm A')}</span></div>
                            </div>
                        </div>
                    ))}
                    {reoccurringMeets.map((meet, i) => (
                        <div className="transition cursor-pointer hover:bg-primary-content/40 p-4 border rounded-xl flex justify-between w-full" key={i} onClick={() => {
                            getResult(eventPickingId, meet.id, true);
                            cancelEventPicking(true);
                        }}>
                            <div>
                                <div className="font-bold">{meet.scope} Event ({meet.name})</div>
                                <div className="mt-1 text-sm">{convertTimeDict(meet.startDict).format('MMM D YYYY')} <span className="ml-1 badge badge-ghost">{convertTimeDict(meet.startDict).format('h:mm A')} - {convertTimeDict(meet.endDict).format('h:mm A')}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal-action">
                    <label className="btn btn-error" onClick={() => {
                        cancelEventPicking();
                        if (previousManual != null) {
                            setManual(previousManual);
                        }
                    }}>Cancel</label>
                </div>
            </div>
        </div>
    )
}