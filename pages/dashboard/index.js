import { SsrRoute } from "@/lib/config";
import { useState, useRef } from "react";
import db from "@/lib/prisma";
import { useRouter } from "next/router";
import Link from "next/link";
import EditAttendee from "@/components/popups/edit_attendee";

export const getServerSideProps = SsrRoute(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        const meets = await db.meet.findMany({
            where: {
                id: { in: user.meets }
            },
            select: {
                id: true,
                name: true,
                image: true,
                qr: true,
                reoccurance: true,
                manual: true,
                _count: {
                    select: { attendees: true }
                }
            }
        });
        const attendees = await db.attendee.findMany({
            where: {
                organizer: {
                    id: user.id
                }
            }
        });
        return {
            props: { meets, attendees, userId: user.id }
        }
    }
)

export default function Dashboard({ meets, attendees, userId }) {
    const [error, setError] = useState('');
    const [edit, setEdit] = useState(false);
    const [attendee, setAttendee] = useState({});
    const nameInput = useRef(null);
    const idInput = useRef(null);
    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const endEdit = () => {
        setEdit(false);
        setAttendee({});
        refreshData();
    }

    const getMeetType = (meet) => {
        var type = "";
        var meetType;
        type += meet.reoccurance ? "Reoccuring" : "Non-Reoccuring";
        if (meet.qr) {
            meetType = "QR";
        } else if (meet.manual) {
            meetType = "Manual";
        } else {
            meetType = "Form";
        }
        return `${type}, ${meetType}`;
    }

    const getInitials = (name) => {
        const name_split = name.split(' ');
        const firstLetter = name_split[0].substring(0,1);
        const secondLetter = name_split[1] ? name_split.at(-1).substring(0,1) : "";
        return (firstLetter + secondLetter).toUpperCase();
    }

    const createAttendee = async (e) => {
        e.preventDefault();
        
        const data = {
            name: e.target.name.value,
            id: e.target.id.value
        }

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        const response = await fetch('/api/post/attendee', options);
        if (response.ok) {
            refreshData();
        } else {
            const data = await response.json();
            setError(data);
        }

        nameInput.current.value = '';
        idInput.current.value = '';

    }

    const deleteAttendee = async (attendeeId) => {
        await fetch(`/api/delete/attendee?id=${attendeeId}`);
        refreshData();
    }

    return (
        <>
            { edit && <EditAttendee endEdit={endEdit} attendee={attendee} setEdit={setEdit} setAttendee={setAttendee} />}
            <div className="glass !bg-primary text-white p-6 rounded-xl">
                <div className="flex justify-end flex-col items-end">
                    <div className="text-3xl font-bold">
                        Aren't in an Organization?
                    </div>
                    <div className="text-lg font-thin">
                        Join or create one now. Collaborate with others for perfect structure.
                    </div>
                    <div className="mt-2 glass btn btn-lg text-white">
                        Join Now
                    </div>
                </div>
            </div>
            { error != "" && (
                <div className="alert alert-error mt-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                </div>
            )}
            <div className="mt-6 gap-5 dashboard-break:grid dashboard-break:grid-cols-3">
                <div className="dashboard-break:col-span-2 flex flex-col gap-1">
                    <div className="flex stats shadow w-full">
                        <div className="basis-1/3 stat p-6">
                            <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div>
                            <div className="stat-title">Total Events Created</div>
                            <div className="stat-value text-primary">63</div>
                            <div className="stat-desc">Events are every 'attendance day' you have made</div>
                        </div>
                        
                        <div className="basis-1/3 stat p-6">
                            <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div className="stat-title">Number of Attendances</div>
                            <div className="stat-value text-secondary">468</div>
                            <div className="stat-desc">Everytime anyone attended an event!</div>
                        </div>
                        
                        <div className="basis-1/3 stat p-6">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-base-content"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            </div>
                            <div className="stat-title">Percent of Participation</div>
                            <div className="stat-value">84%</div>
                            <div className="stat-desc">Both present and tardy count</div>
                        </div>
                    </div>
                    <div className="p-2 text-3xl font-semibold">
                        Meets
                    </div>
                    <div className="grow dashboard-break:max-h-[900px] xl:max-h-[820px] overflow-x-auto dashboard-break:overflow-y-auto flex items-start dashboard-break:justify-start content-start bg-primary-content dashboard-break:flex-wrap gap-6 rounded-xl p-6">
                        { meets.length > 0 ? (
                            <>
                                {meets.map((meet,i) => (
                                    <Link key={i} className="deselected shrink-0 cursor-pointer p-6 rounded-xl bg-base-100 w-72 shadow-sm" href={`/dashboard/${meet.id}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex justify-start gap-4 items-end">
                                                {meet.image ? <img className="rounded-xl w-16 h-16 object-cover" src={meet.image} /> : (
                                                    <div className="avatar placeholder">
                                                        <div className="bg-base-200 text-base-content rounded-xl w-16">
                                                            <span className="text-3xl">{meet.name.substring(0,1).toUpperCase()}{meet.name.substring(1,2)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm text-gray-500">{getMeetType(meet)}</div>
                                                    <div className="text-lg font-bold">{meet.name}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="dropdown dropdown-end">
                                                    <label tabIndex={0} className="deselector btn btn-ghost p-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"></path></svg>
                                                    </label>
                                                    <ul tabIndex={0} className="dropdown-content menu p-2 gap-1 shadow bg-base-100 rounded-box w-32">
                                                        <li><div className="btn btn-ghost btn-sm flex items-center p-0" onClick={() => router.push(`/dashboard/${meet.id}`)}>View</div></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-start items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <div className="text-sm">{meet._count.attendees} Attend</div>
                                        </div>
                                    </Link>
                                ))}
                            </>
                        ): (
                            <div className="shrink-0 p-6 rounded-xl w-72 h-32 shadow-sm flex justify-center items-center bg-white bg-opacity-30 border-2 border-white border-dashed">
                                No Current Meets
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="p-4 mt-5 dashboard-break:mt-3 glass !bg-primary-content rounded-xl">
                        <form className="bg-base-100 rounded-xl w-full p-3" onSubmit={createAttendee}>
                            <div className="font-bold text-lg">
                                Create New Attendee
                            </div>
                            <div className="flex gap-1 xl:gap-4 flex-col xl:flex-row">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Name</span>
                                    </label>
                                    <input ref={nameInput} required name="name" type="text" placeholder="Type here" className="input input-bordered w-full" />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Custom ID (optional)</span>
                                    </label>
                                    <input ref={idInput} name="id" type="text" placeholder="Type here" className="input input-bordered w-full" />
                                </div>
                            </div>
                            <button type="submit" className="mt-3 btn btn-success btn-outline btn-block btn-sm">Create</button>
                        </form>
                    </div>
                    <div>
                        <div className="p-2 pb-0 text-3xl font-semibold">
                                All Attendees
                        </div>
                        <Link className="block pl-2 link link-hover" href={`/${userId}/`}>Attendee Only Page</Link>
                        <Link className="block pl-2 pb-2 link link-hover" href={`/${userId}/qr`}>QR Page</Link>
                        <ul role="list">
                            <div className="max-h-[350px] sm:max-h-[700px] overflow-y-auto flex flex-col gap-4 justify-start content-start p-4 glass !bg-primary rounded-xl">
                                { attendees.length > 0 ? (
                                    <>
                                    {attendees.map((attendee, i) => (
                                        <li key={i} className="flex justify-between p-5 bg-base-100 rounded-xl shadow-sm">
                                            <div className="flex gap-x-4">
                                                <div className="avatar placeholder">
                                                    <div className="bg-base-300 rounded-full w-12 h-12 ring ring-offset-base-100 ring-offset-2">
                                                        <span className="text-2xl">{getInitials(attendee.name)}</span>
                                                    </div>
                                                </div> 
                                                <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6">{attendee.name}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{attendee.specificId}</p>
                                                </div>
                                            </div>
                                            <div className="items-end">
                                                <div className="dropdown dropdown-left">
                                                    <label tabIndex={0} className="btn btn-ghost p-1 m-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"></path></svg>
                                                    </label>
                                                    <ul tabIndex={0} className="dropdown-content menu p-2 gap-2 shadow bg-base-100 rounded-box w-32">
                                                        <li><div className="btn btn-ghost btn-sm flex items-center p-0" onClick={() => {
                                                                setEdit(true);
                                                                setAttendee(attendee);
                                                            }}>Edit</div></li>
                                                        <li><div className="btn btn-error btn-sm flex items-center p-0" onClick={() => deleteAttendee(attendee.id)}>Delete</div></li>
                                                    </ul>
                                                </div>
                                        </div>
                                        </li>
                                    ))}
                                    </>
                                ) : (
                                    <div className="p-6 flex justify-center items-center bg-base-100 opacity-50 rounded-xl">
                                        No Current Attendees
                                    </div>
                                )}
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-2 flex justify-center items-start gap-4">
                <div className="basis-2/3">
                </div>
            </div>
        </>
    )
}