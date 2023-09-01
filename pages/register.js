import { useState, useRef } from "react";
import { useRouter } from "next/router";

export default function Register({ fetchUser, fetchMeets }) {
    const router = useRouter();
    const [type, setType] = useState(true);
    const organizer = useRef(null);
    const org = useRef(null);
    const [error, setError] = useState('');

    const changeType = () => {
        org.current.className = `flex justify-center px-6 py-3 btn ${type ? '' : 'btn-outline'} btn-primary max-sm:flex-grow`;
        organizer.current.className = `flex justify-center px-6 py-3 btn ${type ? 'btn-outline' : ''} btn-primary max-sm:flex-grow`;
        setType(!type)
    }

    const createAccount = async (e) => {
        e.preventDefault();

        const data = {
            email: e.target.email.value,
            name: e.target.name.value,
            password: e.target.password.value,
        };

        if (data.password !== e.target.verify.value) {
            setError('Your passwords do not match');
            return;
        }
        
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }

        const url = `/api/post/${type ? 'organizer' : 'organization'}`;
        const response = await fetch(url, options);

        if (!response.ok) {
            const data = await response.json();
            setError(data.error);
        } else {
            window.location.href = '/dashboard/';
        }
    }

    const removeBtn = () => {
        setError('');
    }

    return (
        <>
           <section className="bg-base-100">
                <div className="flex justify-center min-h-screen">
                    <div className="hidden bg-cover lg:block lg:w-2/5" style={{
                        backgroundImage: "url('/img/register_bg.avif')"
                    }}>
                    </div>
                    <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                        <div className="w-full text-center md:text-left">
                            {error.length != 0 && 
                            <div className="alert alert-error shadow-lg mb-5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h3>{error}</h3>
                                <div className="flex-none">
                                    <button className="btn btn-sm btn-square btn-outline" onClick={removeBtn} type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                            }
                            <h1 className="text-3xl font-bold tracking-tight text-base-content capitalize">
                                Join This App Now.
                            </h1>
                            <p className="mt-4 text-neutral">
                                Let's get you started on organizing events and gatherings.
                            </p>
                            <div className="mt-6">
                                <h1 className="text-neutral">Select type of account</h1>
                                <div className="mt-3 flex max-sm:flex-wrap max-md:justify-center items-center gap-5">
                                    <button className="flex justify-center px-6 py-3 btn btn-primary max-sm:flex-grow" onClick={changeType} ref={organizer} type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="mx-2">
                                            Organizer
                                        </span>
                                    </button>
                                    <button className="flex justify-center px-6 py-3 btn btn-outline btn-primary max-sm:flex-grow" onClick={changeType} ref={org} type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="mx-2">
                                            Organization
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2" onSubmit={createAccount}>
                                <div className="form-control w-full max-w-xs mx-auto">
                                    <label className="label">
                                        <span className="label-text">Your Name / Org Name</span>
                                    </label>
                                    <input name="name" type="text" placeholder="Type Name" className="input input-bordered w-full max-w-xs" />
                                </div>
                                <div className="form-control w-full max-w-xs mx-auto">
                                    <label className="label">
                                        <span className="label-text">Email Address</span>
                                    </label>
                                    <input name="email" type="email" placeholder="Type Email" className="input input-bordered w-full max-w-xs" />
                                </div>
                                <div className="form-control w-full max-w-xs mx-auto">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input name="password" type="password" placeholder="Type Password" className="input input-bordered w-full max-w-xs" />
                                </div>
                                <div className="form-control w-full max-w-xs mx-auto">
                                    <label className="label">
                                        <span className="label-text">Retry Password</span>
                                    </label>
                                    <input name="verify" type="password" placeholder="Verify Password" className="input input-bordered w-full max-w-xs" />
                                </div>
                                <div className="form-control w-full max-w-xs mt-5 mx-auto" mx-auto>
                                    <button
                                    type="submit"
                                        className="flex items-center justify-between btn btn-primary">
                                        <span>Sign Up </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                            <p className="mt-8 md:mt-12 text-center text-sm">
                                Already Have an account?{' '}
                                <a href="/login" className="font-medium text-primary hover:text-primary-focus">
                                    Login here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
      </>
    )
}