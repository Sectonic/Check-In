import { useState, useRef } from "react";
import { Date, DatePicker, TimePicker } from "../meet_selections";
import { useRouter } from "next/router";
import * as dayjs from 'dayjs';

var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

export default function MeetSettings({ setSettings, meet }) {
    const router = useRouter();
    const [dates, setDates] = useState(meet.reoccurances.map((i) => i.date));
    const [name, setName] = useState(meet.name);;
    const [imageB64, setImageB64] = useState(meet.image || null);
    const [scope, setScope] = useState(meet.scope);
    const [startTime, setStartTime] = useState(JSON.parse(meet.startDict));
    const [endTime, setEndTime] = useState(JSON.parse(meet.endDict));
    const [tardy, setTardy] = useState(meet.tardy || null);
    const [tardyCheck, setTardyCheck] = useState(!meet.tardy);
    const [trackAbsent, setTrackAbsent] = useState(meet.trackAbsent);
    const [inclusive, setInclusive] = useState(meet.inclusive);
    const [multipleSubmissions, setMultipleSubmissions] = useState(meet.multipleSubmissions);
    const reoccuring = meet.reoccurance;
    const [error, setError] = useState('');
    const scopeSelect = useRef(null);

    const meetSubmit = async (e) => {
        e.preventDefault();

        const data = {
            oldFileId: meet.fileId,
            meetId: meet.id,
            name, tardy, multipleSubmissions,
            startDict: JSON.stringify(startTime),
            endDict: JSON.stringify(endTime),
            scope, trackAbsent, inclusive,
            reoccurances: dates,
            imageB64: imageB64 === meet.image ? null : imageB64.split('base64,')[1]
        };

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        const response = await fetch('/api/update/meet', options);
        if (response.ok) {
            setSettings(false);
            router.reload();
        } else {
            const responseData = await response.json();
            setError(responseData.error);
        }
        
    }

    const changeImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImageB64(reader.result)
        }
    }

    const deleteMeet = async () => {
        await fetch('/api/delete/meet', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: meet.id })
        });
        setSettings(false);
        window.location.href = '/dashboard';
    }

    const timeDictParser = (timeDict) => {
        var minutes = String(timeDict.minute);
        if (String(timeDict.minute).length < 2) {
            minutes = '0' + minutes
        }
        return `${timeDict.hour}:${minutes} ${timeDict.time}`
    }

    const tardyHandler = (e) => {
        if (!e.target.checked) {
            setTardy('');
        }
        setTardyCheck(!e.target.checked);
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <form className="modal-box" method="POST" onSubmit={meetSubmit}>
                <h3 className="font-bold text-xl">{name} Settings</h3>
                <div className="bg-base-200 p-2 rounded-lg text-xs mt-2">
                    <div>*<strong>You cannot change these</strong></div>
                    <div><strong>Reoccurance: </strong> {reoccuring ? 'True' : 'False'}</div>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input type="text" onChange={(e) => setName(e.target.value)} value={name} required minLength={2} maxLength={32} placeholder="Type here" className="input input-bordered w-full" />
                </div>
                <div className="form-control w-max mt-2">
                    <label className="label cursor-pointer gap-2">
                        <input type="checkbox" className="checkbox checkbox-primary" checked={trackAbsent} onChange={(e) => {
                            setTrackAbsent(e.target.checked);
                            if (e.target.checked && multipleSubmissions) {
                                setMultipleSubmissions(false);
                            }
                        }} />
                        <span className="label-text">Track Absent</span>
                    </label>
                </div>
                <div className="form-control w-max mt-2">
                    <label className="label cursor-pointer gap-2">
                        <input type="checkbox" disabled={trackAbsent} className="checkbox checkbox-primary" checked={multipleSubmissions} onChange={(e) => setMultipleSubmissions(e.target.checked)} />
                        <span className="label-text">Multiple Event Attendances</span>
                    </label>
                </div>
                <div className="form-control w-max mt-2">
                    <label className="label cursor-pointer gap-2">
                        <input type="checkbox" className="checkbox checkbox-primary" checked={inclusive} onChange={(e) => setInclusive(e.target.checked)} />
                        <span className="label-text">Include All Attendees</span>
                    </label>
                </div>
                <div className="ml-1 mt-2 label-text">Tardies (min)</div>
                <div className="flex items-center gap-3 ml-1 mt-1">
                    <input type="checkbox" className="checkbox checkbox-primary" onChange={tardyHandler} checked={!tardyCheck} />
                    <input type="text" value={tardy} onChange={(e) => setTardy(e.target.value.replace(/\D/g, ""))} placeholder="Minutes untill tardy" className="input input-bordered w-full" disabled={tardyCheck} />
                </div>
                { meet.reoccurance && (
                    <>
                        <div className="ml-1 mt-2 font-semibold">Reoccuring Options</div>
                        <div className="flex justify-center gap-3">
                            <div className="basis-1/2">
                                <TimePicker 
                                    value={timeDictParser(startTime)}
                                    setTime={setStartTime}
                                    time={startTime}
                                    label="Start Time" 
                                    reoccuring={reoccuring} 
                                />
                            </div>
                            <div className="basis-1/2">
                                <TimePicker 
                                    value={timeDictParser(endTime)}
                                    setTime={setEndTime}
                                    time={endTime}
                                    label="End Time" 
                                    reoccuring={reoccuring} 
                                    position="end"
                                /> 
                            </div>
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Scope</span>
                            </label>
                            <select className="select select-bordered" onChange={(e) => {setScope(e.target.value); setDates([])}} ref={scopeSelect} defaultValue={scope} disabled={reoccuring ? '' : 'disabled'}>
                                <option disabled>Select a scope</option>
                                <option>Daily</option>
                                <option>Weekly</option>
                            </select>
                        </div>
                        { scope == 'Weekly' && (
                            <div className="mt-2 px-1 text-sm">
                                <div className="font-semibold">
                                    Weekly Scope
                                </div>
                                <div className="text-xs -mt-1">
                                    *Select days of the week you wish to interval
                                </div>
                                <DatePicker dates={dates} setDates={setDates}>
                                    <Date abr="Su" num={1} />
                                    <Date abr="Mo" num={2}/>
                                    <Date abr="Tu" num={3}/>
                                    <Date abr="We" num={4}/>
                                    <Date abr="Th" num={5}/>
                                    <Date abr="Fr" num={6}/>
                                    <Date abr="Sa" num={7}/>
                                </DatePicker>
                            </div>
                        )}  
                    </>
                )}
                <div className="ml-1 label-text font-semibold mt-4">Meet Picture</div>
                <div className="mt-4 flex justify-center items-center gap-4 flex-col">
                    {imageB64 ? (
                        <div className="avatar">
                            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={imageB64} />
                            </div>
                        </div>
                    ) : (
                        <div className="avatar placeholder">
                            <div className="bg-base-300 text-base-content rounded-full w-20 ring ring-primary ring-offset-base-100 ring-offset-2">
                                <span className="text-3xl font-semibold">{name.substring(0,1).toUpperCase()}{name.substring(1,2)}</span>
                            </div>
                        </div>
                    )}
                    <input name="image" type="file" onChange={changeImage} className="file-input file-input-bordered file-input-primary file-input-sm w-full" />
                </div>
                { error.length > 0 && (
                    <div className="alert alert-error mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                <div className="modal-action">
                    <button className="btn btn-success" type="submit">Save</button>
                    <button className="btn btn-error" type="button" onClick={deleteMeet}>Delete</button>
                    <label className="btn btn-ghost" onClick={() => setSettings(false)}>Dismiss</label>
                </div>
            </form>
        </div>
    )
}