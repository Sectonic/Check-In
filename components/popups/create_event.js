import { useState } from "react";
import { TimePicker } from "../meet_selections";
import { useRouter } from "next/router";
import * as dayjs from 'dayjs';
import Datepicker from "react-tailwindcss-datepicker"; 

var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

export default function CreateEvent({ setCreate, currentMeet }) {
    const router = useRouter();
    const [name, setName] = useState('');;
    const [startTime, setStartTime] = useState({hour: '--', minute: '--', time: '--'});
    const [endTime, setEndTime] = useState({hour: '--', minute: '--', time: '--'});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [value, setValue] = useState({ 
        startDate: null, 
        endDate: null
    });

    const meetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!value.startDate) {
            setError('A date must be specified');
            setLoading(false);
            return; 
        }

        if (timeDictParser(startTime) === '--:-- --' || timeDictParser(endTime) === '--:-- --') {
            setError('Both start and end times are required');
            setLoading(false);
            return;
        }

        const checkDurationHours = (dict) => {
            if (dict.time === 'PM' && dict.hour < 12) {
                return dict.hour + 12;
            }
            if (dict.time === 'AM' && dict.hour === 12) {
                return 0;
            }
            return dict.hour;
        }

        var startDuration = dayjs.duration({
            hours: checkDurationHours(startTime),
            minutes: startTime.minute,
            seconds: startTime.second
        }).asSeconds();
        var endDuration = dayjs.duration({
            hours: checkDurationHours(endTime),
            minutes: endTime.minute,
            seconds: endTime.second
        }).asSeconds();

        if (startDuration > endDuration) {
            setError('Change your start time to be lower than your end time.');
            setLoading(false);
            return;
        }

        const startUnix = dayjs(value.startDate).set('hour', checkDurationHours(startTime)).set('minute', startTime.minute).set('second', 0);
        const endUnix = dayjs(value.startDate).set('hour', checkDurationHours(endTime)).set('minute', endTime.minute).set('second', 0);

        const data = {
            name,
            startTime: startUnix.unix(),
            endTime: endUnix.unix(),
            meetId: currentMeet.id,
        };

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        const response = await fetch('/api/post/event', options);
        const responseData = await response.json();
        if (response.ok) {
            setCreate(false);
            setLoading(false);
            router.push('/dashboard/' + router.query.meet_slug + '/attendance?' + new URLSearchParams({search: '', eventId: responseData.eventId }));
        } else {
            setError(responseData.error);
            setLoading(false);
        }
        
    }

    const timeDictParser = (timeDict) => {
        var minutes = String(timeDict.minute);
        if (String(timeDict.minute).length < 2) {
            minutes = '0' + minutes
        }
        return `${timeDict.hour}:${minutes} ${timeDict.time}`
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle overflow-y-auto">
            <form className="modal-box overflow-y-visible" method="POST" onSubmit={meetSubmit}>
                <h3 className="font-bold text-xl">Create new event</h3>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input type="text" onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={32} placeholder="Type here" className="input input-bordered w-full" />
                </div>
                <div className="text-[14px] px-1 mt-2">Date</div>
                <Datepicker 
                    inputClassName="relative transition-all outline-0 ring-0 duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 bg-white rounded-lg tracking-wide font-light text-sm placeholder-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    value={value} 
                    onChange={(e) => setValue(e)} 
                    readOnly={true} 
                    asSingle={true} 
                    useRange={false}
                    popoverDirection="down"
                /> 
                <div className="flex justify-center gap-3">
                    <div className="basis-1/2">
                        <TimePicker 
                            value={timeDictParser(startTime)}
                            setTime={setStartTime}
                            time={startTime}
                            label="Start Time" 
                            reoccuring={true} 
                        />
                    </div>
                    <div className="basis-1/2">
                        <TimePicker 
                            value={timeDictParser(endTime)}
                            setTime={setEndTime}
                            time={endTime}
                            label="End Time" 
                            reoccuring={true} 
                            position="end"
                        /> 
                    </div>
                </div>
                { error.length > 0 && (
                    <div className="alert alert-error mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                <div className="modal-action">
                    <button className="btn btn-success" type="submit">
                        { loading && <span className="loading loading-spinner"></span>}
                        Create
                    </button>
                    <label className="btn btn-ghost" onClick={() => setCreate(false)}>Dismiss</label>
                </div>
            </form>
        </div>
    )
}