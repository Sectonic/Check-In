import db from "@/lib/prisma";
import { useQRCode } from "next-qrcode";
import { useEffect } from "react";
import 'animate.css';

export const getServerSideProps = async ({ params, query }) => {
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
    const attendees = await db.attendee.findMany({
        where: {
            organizer: {
                id: name.id
            }
        },
        select: {
            name: true,
            specificId: true
        }
    });
    return {
        props: { attendees, name: name.name, scrollTo: query.attendee || null }
    }
}


export default function Page({ attendees, name, scrollTo }) {
    const { Canvas } = useQRCode();

    useEffect(() => {
        if (scrollTo) {
           const el = document.getElementById(scrollTo);
           if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            el.classList.add('animate__animated', 'animate__flash');
           }
        }
    }, [])

    return (
        <div className="mx-auto max-w-[1700px]">
            <h1 className="text-2xl font-semibold">{name}'s Attendee QR List</h1>
            <div className="flex justify-center gap-5 flex-wrap items-center p-5">
                {attendees.map(attendee => (
                    <div className="p-5 bg-primary-content shadow-lg rounded-lg flex justify-center flex-col gap-2" key={attendee.specificId} id={attendee.specificId}>
                        <div className="text-center -mb-1">{attendee.name}</div>
                        <div className="font-bold text-center">{name}</div>
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
                                src: 'https://ui-avatars.com/api/?background=fff&color=000&rounded=true&bold=true&font-size=.6&' + new URLSearchParams({name}),
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
        </div>
    )
}