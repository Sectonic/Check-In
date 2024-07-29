import { useState } from "react";

export default function Register() {
    const [error, setError] = useState('');

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

        const url = '/api/post/register';
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
                                            <path fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd" />
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