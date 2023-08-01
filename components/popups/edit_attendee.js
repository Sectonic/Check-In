import { useState } from "react";

export default function EditAttendee({ endEdit, attendee, setEdit, setAttendee}) {
    const [name, setName] = useState(attendee.name);
    const [specificId, setSpecificId] = useState(attendee.specificId);
    const [error, setError] = useState('');

    const editHandler = async (e) => {
        e.preventDefault();

        const request = await fetch(`/api/update/attendee?id=${attendee.id}&name=${name}&specificId=${specificId}`);
        if (request.ok) {
            endEdit();
        } else {
            const data = await request.json();
            setError(data.error);
        }

    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <form className="modal-box" onSubmit={editHandler}>
                <h3 className="font-bold text-xl">Edit Attendee: {name}</h3>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input required type="text" placeholder="Type a name" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">ID</span>
                    </label>
                    <input required maxLength={16} type="text" placeholder="Type an ID" className="input input-bordered w-full" value={specificId} onChange={(e) => setSpecificId(e.target.value)} />
                </div>
                { error.length > 0 && (
                    <div className="alert alert-error mt-5">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}
                <div className="modal-action">
                    <button className="btn btn-success" type="submit">Edit</button>
                    <label className="btn btn-ghost" onClick={() => {
                        setEdit(false);
                        setAttendee({});
                    }}>Dismiss</label>
                </div>
            </form>
        </div>
    )
}