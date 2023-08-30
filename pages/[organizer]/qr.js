import db from "@/lib/prisma";
import { useQRCode } from "next-qrcode";
import { useEffect, useState } from "react";
import 'animate.css';

export const getServerSideProps = async ({ params }) => {
    if (!params || Number.isNaN(params.organizer)) {
        return { redirect: { destination: '/', permanent: false } } 
    }

    const name = await db.organizer.findUnique({
        where: {
            id: Number(params.organizer)
        },
        select: {
            name: true,
            id: true
        }
    });
    if (!name) {
        return { redirect: { destination: '/', permanent: false } } 
    }

    return {
        props: { organizer: name }
    }
}


export default function Page({ organizer }) {
    const { SVG } = useQRCode();
    const [attendees, setAttendees] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const getAttendees = async () => {
        const req = await fetch('/api/get/attendees?' + new URLSearchParams({ organizerId: organizer.id, search: search }));
        const data = await req.json();
        setAttendees(data.attendees);
        setLoading(true)
    }

    useEffect(() => {
        getAttendees();
    }, []);

    return (
        <div className="mx-auto max-w-[1700px]">
            <h1 className="text-2xl font-semibold max-sm:text-center">{organizer.name}'s Attendee QR List</h1>
            { loading ? (
                <>  
                    <div className="mx-auto max-sm:px-4 w-full sm:w-1/2 form-control mt-4">
                        <div className="input-group">
                            <input name="search" type="text" placeholder="Search By Name/ID" className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <button className="btn btn-square btn-primary" type="button" onClick={() => getAttendees()}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center gap-5 flex-wrap items-center p-5">
                        {attendees.map(attendee => (
                            <div className="p-5 bg-primary-content shadow-lg rounded-lg flex justify-center flex-col gap-2" key={attendee.specificId}>
                                <div className="text-center -mb-1">{attendee.name}</div>
                                <div className="font-bold text-center">{organizer.name}</div>
                                <SVG
                                    text={attendee.specificId}
                                    options={{
                                        level: 'L',
                                        margin: 2,
                                        scale: 5,
                                        width: 150,
                                        color: {
                                        dark: '#000',
                                        light: '#fff',
                                        },
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center mt-10">
                    <div className='mx-auto' role="status">
                        <span className="loading loading-dots loading-md"></span>
                    </div>
                </div>
            )}
        </div>
    )
}