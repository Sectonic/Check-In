import db from "@/lib/prisma";

export const getServerSideProps = async ({ params }) => {
    if (Number.isNaN(params.organizer)) {
        return { redirect: { destination: '/', permanent: false } } 
    }
    const name = await db.organizer.findUnique({
        where: {
            id: Number(params.organizer)
        }
    });
    if (!name) {
        return { redirect: { destination: '/', permanent: false } } 
    }



    return {
        props: { organizer: name }
    }
}

// Average Attendance %, Average Time Submitted, Number of Total Hours, Number of Events Attended, Number of Events not attended
// Show the stats above, 

export default function Organizer({ organizer }) {
    return (
        <div className="mx-auto max-w-[1700px]">
            <h1 className="text-2xl font-semibold max-sm:text-center">{organizer.name}'s Attendee Only List</h1>
            <div>
                
            </div>
        </div>
    )
}