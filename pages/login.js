import {useState} from 'react';
import { useRouter } from "next/router";

export default function Login({ fetchUser, fetchMeets }) {
  const [error, setError] = useState('');
  const router = useRouter();
  
  const removeBtn = () => {
    setError('');
  }

  const checkLogin = async (e) => {
    e.preventDefault();
    const url = `/api/get/login?email=${e.target.email.value}&password=${e.target.password.value}`;
    const response = await fetch(url);
    if (!response.ok) {
      const data = await response.json();
      setError(data.error);
    } else {
      window.location.href = '/dashboard/';
    }
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="/img/logo.png"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-base-content">
              Or{' '}
              <a href="/register" className="font-medium text-primary hover:text-primary-focus">
                register a new account
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={checkLogin}>
          {error.length != 0 && 
          <div className="alert alert-error shadow-lg mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3>{error}</h3>
              <div className="flex-none">
                  <button className="btn btn-sm btn-square btn-outline" onClick={removeBtn} type='button'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
          </div>
          }
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full input input-bordered my-3"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full input input-bordered"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex justify-center">
            <button
              type='submit'
                className="flex items-center w-3/5  justify-between btn btn-primary">
                <span>Login </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                </svg>
            </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}