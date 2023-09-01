import { useState } from "react";

export default function EditOrganizer({ setProfile, organizer, fetchUser }) {
    const [name, setName] = useState(organizer.name);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [editLoad, setEditLoad] = useState(false);
    const [deleteLoad, setDeleteLoad] = useState(false);

    const deleteHandler = async () => {
        setDeleteLoad(true);
        await fetch('/api/delete/user');
        window.location.href = '/';
    }

    const editHandler = async (e) => {
        e.preventDefault();
        setEditLoad(true);
        await fetch('/api/update/user?' + new URLSearchParams({ name }));
        await fetchUser();
        setProfile(false);
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <form className="modal-box" onSubmit={editHandler}>
                <h3 className="font-bold text-xl">{name}'s Profile</h3>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input required type="text" placeholder="Type a name" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input required readOnly type="text" value={organizer.email} placeholder="Type a name" className="input input-bordered w-full" />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input required disabled type="password" placeholder="Type a name" value="randomthing" className="input input-bordered w-full" />
                </div>
                { deleteAlert && (
                    <div className="alert alert-warning mt-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span className="font-semibold">Are you sure?</span>
                        <div className="flex gap-2">
                            <button className="btn btn-sm btn-ghost" type="button" onClick={() => setDeleteAlert(false)}>Nevermind</button>
                            <button className="btn btn-sm btn-error" type="button" onClick={deleteHandler}>
                                { deleteLoad && <span className="loading loading-spinner"></span>}
                                Delete
                            </button>
                        </div>
                    </div>
                )}
                { !deleteAlert && (
                    <div className="modal-action">
                        <button className="btn btn-success" type="submit">
                            { editLoad && <span className="loading loading-spinner"></span>}
                            Edit
                        </button>
                        <div className="btn btn-error" onClick={() => setDeleteAlert(true)}>Delete</div>
                        <label className="btn btn-ghost" onClick={() => {
                            setProfile(false);
                        }}>Dismiss</label>
                    </div>
                )}
            </form>
        </div>
    )
}