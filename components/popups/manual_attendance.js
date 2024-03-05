import { useRef } from "react";

export default function ManualAttendance({ setManual, success_audio, startEventPicking }) {
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
            }

            const options = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(data)
            }

            const response = await fetch('/api/post/attendance', options);
            const responseData = await response.json();

            if (responseData.message == "Pick between these events") {
                idInput.current.value = "";
                startEventPicking(attendeeId, responseData, true);
                setManual(false);
                return;
            }

            if (response.status == 200 && responseData.message !== "Already submitted") {
              success_audio.play();
            }

            messageType.current.className = `alert my-4 ${response.ok ? 'alert-success' : 'alert-error'}`;
            messageData.current.innerHTML = responseData.message + " @" + responseData.id;
            idInput.current.value = "";

            if (response.ok) {
                setTimeout(() => {
                    setManual(false);
                }, 500)
            } else {
                setTimeout(() => {
                    if (messageData.current && messageData.current.innerHTML === responseData.message + " @" + responseData.id) {
                      messageData.current.innerHTML = "No Submission";
                      messageType.current.className = "alert my-4";
                    }
                }, 1500)
            }

        }
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-xl">Manual Entry</h3>
                <div>Put in your ID and click "Enter" on the Keypad</div>
                <div className="alert my-4" ref={messageType}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span ref={messageData}>No Submission</span>
                </div>
                <div>
                    <div className="ml-1">Attendee ID:</div>
                    <form className="join w-full mt-2" onSubmit={formSubmit}>
                        <input name="id" className="input input-bordered join-item flex-grow" ref={idInput} autoComplete='off' />
                        <button type="submit" className="btn btn-primary join-item rounded-r-xl">Submit</button>
                    </form>
                </div>
                <div className="modal-action">
                    <label className="btn btn-ghost" onClick={() => setManual(false)}>Dismiss</label>
                </div>
            </div>
        </div>
    )
}