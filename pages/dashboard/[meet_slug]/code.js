import { useRef } from 'react';
import audio from '@/public/success_sound.mp3';

export const getServerSideProps = async ({ params }) => {
    return { props: { meet: params.meet_slug }};
}

export default function Page({ meet }) {
    const success_audio = new Audio(audio);
    const messageData = useRef(null);
    const messageType = useRef(null);
    const idInput = useRef(null);

    const formSubmit = async (e) => {
        e.preventDefault();

        const attendeeId = e.target.id.value;
        if (!messageData.current.innerHTML.includes(attendeeId)) {
            messageData.current.innerHTML = 'Reading...';
      
            const data = {
              attendeeId: attendeeId,
              meetId: Number(meet)
            }
            const options = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(data)
            }
            const response = await fetch('/api/post/attendance/qr', options);
            const responseData = await response.json();
            if (response.ok && responseData.message.split("@")[0] !== "You have already submitted attendance") {
              success_audio.play();
            }
            messageType.current.className = `alert mb-3 max-w-[500px] mt-2 ${response.ok ? 'alert-success' : 'alert-error'}`;
            messageData.current.innerHTML = responseData.message;
            idInput.current.value = "";
        
            setTimeout(() => {
              if (messageData.current && messageData.current.innerHTML === responseData.message) {
                messageData.current.innerHTML = "No Submission";
                messageType.current.className = "alert mb-3 max-w-[500px] mt-2";
              }
            }, 1500)
        }
    }

    return (
        <div className="flex justify-center items-center flex-col h-[calc(100vh-115px)]">
            <div className="text-4xl font-bold">ID Attendance</div>
            <div className='mt-1'>Put in your Student ID and click "Enter" on the Keypad</div>
            <div className="alert mb-3 max-w-[500px] mt-2" ref={messageType}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span ref={messageData}>No Submission</span>
            </div>
            <div>
                <div className="ml-1">Attendee ID:</div>
                <form className="join w-[500px] mt-2" onSubmit={formSubmit}>
                    <input name="id" className="input input-bordered join-item flex-grow" ref={idInput} autoComplete='off' />
                    <button type="submit" className="btn btn-primary join-item rounded-r-xl">Submit</button>
                </form>
            </div>
        </div>
    )
}
