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
    const { Canvas } = useQRCode();
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
                                <Canvas
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
                                    logo={{
                                        src: 'https://ui-avatars.com/api/?background=fff&color=000&rounded=true&bold=true&font-size=.6&' + new URLSearchParams({name: organizer.name}),
                                        options: {
                                        width: 35,
                                        x: undefined,
                                        y: undefined,
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center mt-10">
                    <div className='mx-auto' role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-base-300 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </div>
                </div>
            )}
        </div>
    )
}