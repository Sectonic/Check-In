import { useRouter } from "next/router";
import { useState } from "react";

const CsvImportPopup = ({ setCsvImport, oldAttendees }) => {
    const [csv, setCsv] = useState([]);
    const [cols, setCols] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handler = async (e) => {
        if (e.target.files) {
            try {
                const file = e.target.files[0];
                const fileUrl = URL.createObjectURL(file);
                const response = await fetch(fileUrl);
                const text = await response.text();
                const lines = text.split("\n");
                const data = lines.map((line) => line.split(",").map(field => field.trim()));
                setCsv(data);
                setCols(true);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const headlerHandler = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError('');

        if (e.target.name.value === 'Pick one') {
            setError('A name header is required.');
            setLoading(false);
            return;  
        }

        if (e.target.id.value === e.target.name.value) {
            setError('Cannot use the same header in both.');
            setLoading(false);
            return;
        }

        const data = {
            newAttendees: csv.splice(1).map(row => {
                const idIndex = e.target.id.value !== 'None' ? csv[0].indexOf(e.target.id.value) : null;
                const nameIndex = csv[0].indexOf(e.target.name.value);
                return { name: row[nameIndex], id: idIndex !== null ? row[idIndex] : null };
            }),
            oldAttendees
        };

        await fetch('/api/post/batch_attendee', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        router.reload();
    }

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-xl">Import Attendees</h3>
                <div className="my-1 bg-base-200 p-2 rounded-lg text-xs">*Be aware that this will remove all current attendees</div>
                { !cols ? (
                    <>
                        <div className="mx-auto form-control w-full mt-4">
                            <input type="file" accept=".csv" className="file-input-primary file-input file-input-bordered w-full" onChange={handler} />
                        </div>
                        <div className="modal-action">
                            <label className="btn btn-ghost" onClick={() => setCsvImport(false)}>Close</label>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="alert alert-success py-2 rounded-lg mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Your CSV file is uploaded</span>
                        </div>
                        <form onSubmit={headlerHandler}>
                            <div className="flex gap-3 mt-1">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">ID Header</span>
                                    </label>
                                    <select className="select select-bordered" name="id">
                                        <option selected>None</option>
                                        {csv[0].map(header => <option>{header}</option>)}
                                    </select>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Name Header</span>
                                    </label>
                                    <select className="select select-bordered" name="name" required>
                                        <option disabled selected>Pick one</option>
                                        {csv[0].map(header => <option>{header}</option>)}
                                    </select>
                                </div>
                            </div>
                            { error.length > 0 && (
                                <div className="alert alert-error py-2 rounded-lg mt-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className="modal-action">
                                <button className="btn btn-success" type="submit">
                                    { loading && <span className="loading loading-spinner"></span>}
                                    Add
                                </button>
                                <label className="btn btn-ghost" onClick={() => setCsvImport(false)}>Close</label>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default CsvImportPopup;