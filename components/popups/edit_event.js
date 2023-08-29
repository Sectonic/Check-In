import { useRouter } from "next/router";
import { useState } from "react";

export default function EditEvent({ event, setEventEdit, currentMeet }) {
    const [name, setName] = useState(event.name);
    const [error, setError] = useState('');
    const router = useRouter();

    const editHandler = async (e) => {
        e.preventDefault();

        if (name === event.name) {
            return;
        }

        const request = await fetch(`/api/update/event?` + new URLSearchParams({ id: event.id, name, meetId: currentMeet.id }));
        if (request.ok) {
            if (!router.query.search && !router.query.eventId) {
                router.reload();
            } else {
                router.push(`/dashboard/${router.query.meet_slug}/attendance?` + new URLSearchParams({ search: '', eventId: '' }));
            }
        } else {
            const data = await request.json();
            setError(data.error);
        }

    }

    const deleteHandler = async () => {
        await fetch(`/api/delete/event?id=${event.id}`);
        if (!router.query.search && !router.query.eventId) {
            router.reload();
        } else {
            router.push(`/dashboard/${router.query.meet_slug}/attendance?` + new URLSearchParams({ search: '', eventId: '' }));
        }
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <form className="modal-box" onSubmit={editHandler}>
                <h3 className="font-bold text-xl">Edit Event: {name}</h3>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input required type="text" placeholder="Type a name" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                { error.length > 0 && (
                    <div className="alert alert-error mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                <div className="modal-action">
                    <button className="btn btn-success" type="submit">Edit</button>
                    <button className="btn btn-error" type="button" onClick={deleteHandler}>Delete</button>
                    <label className="btn btn-ghost" onClick={() => {
                        setEventEdit(false);
                    }}>Dismiss</label>
                </div>
            </form>
        </div>
    )
}