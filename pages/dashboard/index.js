import { SsrRoute } from "@/lib/config";
import { useState, useRef } from "react";
import db from "@/lib/prisma";
import { useRouter } from "next/router";
import Link from "next/link";
import EditAttendee from "@/components/popups/edit_attendee";
import CsvImportPopup from "@/components/popups/csvImport";
import CreateAttendee from "@/components/popups/create_attendee";

export const getServerSideProps = SsrRoute(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        const userAttendees = await db.attendee.count({
            where: { organizer: { id: user.id } }
        })
        const meets = await db.meet.findMany({
            where: {
                organizer: {
                    id: user.id
                }
            },
            select: {
                id: true,
                name: true,
                image: true,
                reoccurance: true,
                inclusive: true,
                _count: {
                    select: { 
                        attendees: true,
                        events: true
                    },
                }
            }
        });
        const attendees = await db.attendee.findMany({
            where: { organizer: {id: user.id} },
            take: 5,
            orderBy: {
                id: 'desc'
            }
        });
        const eventCount = await db.event.count({
            where: { meet: { organizer: { id: user.id } } }
        });
        const attendanceCount = await db.attendance.count({
            where: { attendee: { organizer: { id: user.id }}, attended: true }
        });
        const totalAttendees = () => {
            var total = 0;
            meets.forEach(meet => total += ((meet.inclusive ?  userAttendees : meet._count.attendees) * meet._count.events));
            return total;
        }
        const participation = totalAttendees() > 0 ? Math.round((attendanceCount / totalAttendees()) * 100) : 0;
        return {
            props: { meets, oldAttendees: attendees, userId: user.id, eventCount, attendanceCount, participation }
        }
    }
)

export default function Dashboard({ meets, oldAttendees, userId, eventCount, attendanceCount, participation }) {
    const [edit, setEdit] = useState(false);
    const [attendeeCreate, setAttendeeCreate] = useState(false);
    const [csvImport, setCsvImport] = useState(false);
    const [attendees, setAttendees] = useState(oldAttendees);
    const [all, setAll] = useState(false);
    const [attendee, setAttendee] = useState({});
    const [search, setSearch] = useState('');
    const router = useRouter();

    const endEdit = () => {
        setEdit(false);
        setAttendee({});
        searchHandler();
    }

    const getInitials = (name) => {
        const name_split = name.split(' ');
        const firstLetter = name_split[0].substring(0,1);
        const secondLetter = name_split[1] ? name_split.at(-1).substring(0,1) : "";
        return (firstLetter + secondLetter).toUpperCase();
    }

    const searchHandler = async (e = null) => {
        if (e) {
            e.preventDefault();
        }
        const attendeeReq = await fetch('/api/get/overview_attendees?' + new URLSearchParams({ organizerId: userId, search }));
        const attendeeData = await attendeeReq.json();
        setAll(true);
        if (search === '') {
            setAll(false);
        }
        setAttendees(attendeeData.attendees);
    }

    const getAllAttendees = async () => {
        const attendeeReq = await fetch('/api/get/overview_attendees?' + new URLSearchParams({ organizerId: userId, search, all: true }));
        const attendeeData = await attendeeReq.json();
        setAttendees(attendeeData.attendees);
        setAll(true);
    }

    return (
        <>
            { edit && <EditAttendee endEdit={endEdit} attendee={attendee} setEdit={setEdit} setAttendee={setAttendee} />}
            { csvImport && <CsvImportPopup setCsvImport={setCsvImport} oldAttendees={attendees} />}
            { attendeeCreate && <CreateAttendee setCreate={setAttendeeCreate} />}
            <div className="flex justify-start gap-4">
                <Link className="btn btn-primary btn-sm text-primary-content gap-2" href="/dashboard/qr">
                    <img src="/img/qr-scan.png" className="w-5 h-5" />
                    Global Scanner
                </Link>
                <div className="btn btn-primary btn-sm text-primary-content gap-2">
                    <img src="/img/keyboard-down-blue.png" className="w-5 h-5" />
                    Global Manual
                </div>
            </div>
            <div className="mt-6 gap-5 dashboard-break:grid dashboard-break:grid-cols-3">
                <div className="dashboard-break:col-span-2 flex flex-col gap-1">
                    <div className="flex stats shadow w-full">
                        <div className="basis-1/3 stat p-6">
                            <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div>
                            <div className="stat-title">Total Events Created</div>
                            <div className="stat-value text-primary">{eventCount}</div>
                            <div className="stat-desc">Events are every 'attendance day' you have made</div>
                        </div>
                        
                        <div className="basis-1/3 stat p-6">
                            <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div className="stat-title">Number of Attendances</div>
                            <div className="stat-value text-secondary">{attendanceCount}</div>
                            <div className="stat-desc">Everytime anyone attended an event!</div>
                        </div>
                        
                        <div className="basis-1/3 stat p-6">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-base-content"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            </div>
                            <div className="stat-title">Percent of Participation</div>
                            <div className="stat-value">{participation || '0'}%</div>
                            <div className="stat-desc">Both present and tardy count</div>
                        </div>
                    </div>
                    <div className="p-2 text-3xl font-semibold">
                        Meets
                    </div>
                    <div className="grow dashboard-break:max-h-[900px] xl:max-h-[820px] overflow-x-auto dashboard-break:overflow-y-auto flex items-start dashboard-break:justify-start content-start bg-base-300 dashboard-break:flex-wrap gap-6 rounded-xl p-6">
                        { meets.length > 0 ? (
                            <>
                                {meets.map((meet,i) => (
                                    <Link key={i} className="deselected shrink-0 cursor-pointer p-6 rounded-xl bg-base-100 w-72 shadow-sm" href={`/dashboard/${meet.id}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex justify-start gap-4 items-end">
                                                {meet.image ? <img className="rounded-xl w-16 h-16 object-cover" src={meet.image} /> : (
                                                    <div className="static avatar placeholder">
                                                        <div className="bg-base-200 text-base-content rounded-xl w-16">
                                                            <span className="text-3xl">{meet.name.substring(0,1).toUpperCase()}{meet.name.substring(1,2)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-lg font-bold">{meet.name}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="dropdown dropdown-end">
                                                    <label tabIndex={0} className="deselector btn btn-ghost p-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"></path></svg>
                                                    </label>
                                                    <ul tabIndex={0} className="dropdown-content menu p-2 gap-1 shadow bg-base-100 rounded-box w-32">
                                                        <li><div className="btn btn-ghost btn-sm flex items-center" onClick={() => router.push(`/dashboard/${meet.id}`)}>View</div></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-start items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <div className="text-sm">{meet.inclusive ? 'All' : meet._count.attendees} Attend</div>
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
                    <div>
                        <div className="p-2 pb-0 text-3xl font-semibold">
                                All Attendees
                        </div>
                        <div className="px-2 pb-2 flex justify-between mt-1">
                            <div>
                                <Link className="block link link-hover" href={`/${userId}/`}>Attendee Only Page</Link>
                                <Link className="block link link-hover" href={`/${userId}/qr`}>QR Page</Link>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="btn btn-primary btn-sm text-primary-content gap-1" onClick={() => setAttendeeCreate(true)}>
                                    <svg className="w-4 h-4 text-primary-content" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 7.828 1h8.239A.969.969 0 0 1 17 2v16a.969.969 0 0 1-.933 1H3.933A.97.97 0 0 1 3 18v-2M8 1v4a1 1 0 0 1-1 1H3m-2 6h10M9.061 9.232 11.828 12l-2.767 2.768"/>
                                    </svg>
                                    Create New
                                </div>
                                <div className="btn btn-primary btn-sm text-primary-content gap-1" onClick={() => setCsvImport(true)}>
                                    <svg className="w-4 h-4 text-primary-content" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 7.828 1h8.239A.969.969 0 0 1 17 2v16a.969.969 0 0 1-.933 1H3.933A.97.97 0 0 1 3 18v-2M8 1v4a1 1 0 0 1-1 1H3m-2 6h10M9.061 9.232 11.828 12l-2.767 2.768"/>
                                    </svg>
                                    Import
                                </div>
                            </div>
                        </div>
                        <div className="my-2 mb-3 form-control w-full">
                            <form className="input-group" onSubmit={searchHandler}>
                            <input name="search" type="text" placeholder="Search Name/ID" className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <button className="btn btn-square btn-primary" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                            </form>
                        </div>
                        <ul role="list">
                            <div className="max-h-[350px] sm:max-h-[640px] overflow-y-auto flex flex-col gap-4 justify-start content-start p-4 glass !bg-primary rounded-xl">
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
                                                        <li><div className="btn btn-ghost btn-sm flex items-center" onClick={() => {
                                                                setEdit(true);
                                                                setAttendee(attendee);
                                                            }}>Edit</div></li>
                                                    </ul>
                                                </div>
                                        </div>
                                        </li>
                                    ))}
                                    { !all && <li className="p-3 bg-base-100 rounded-xl shadow-sm text-center cursor-pointer hover:bg-base-300" onClick={getAllAttendees}>
                                        Show All
                                    </li>}
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