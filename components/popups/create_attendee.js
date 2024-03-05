import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateAttendee({ setCreate }) {
    const [name, setName] = useState('');
    const [specificId, setSpecificId] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const createHandler = async (e) => {
        e.preventDefault();
        
        const data = { name, id: specificId };

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        const response = await fetch('/api/post/attendee', options);
        if (response.ok) {
            setCreate(false);
            router.reload();
        } else {
            const data = await response.json();
            setError(data.error);
            setSpecificId('');
            setName('');
        }

    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <form className="modal-box" onSubmit={createHandler}>
                <h3 className="font-bold text-xl">Create Attendee</h3>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input required type="text" placeholder="Type a name" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Custom ID (optional)</span>
                    </label>
                    <input maxLength={16} type="text" placeholder="Type a custom ID (optional)" className="input input-bordered w-full" value={specificId} onChange={(e) => setSpecificId(e.target.value)} />
                </div>
                { error.length > 0 && (
                    <div className="alert alert-error mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                <div className="modal-action">
                    <button className="btn btn-success" type="submit">Create</button>
                    <label className="btn btn-ghost" onClick={() => {
                        setCreate(false);
                    }}>Dismiss</label>
                </div>
            </form>
        </div>
    )
}