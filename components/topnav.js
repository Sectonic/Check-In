import Link from "next/link"
import { useState } from "react";
import EditOrganizer from "./popups/edit_organizer";

export default function TopNav({ user, Logout, fetchUser }) {
  const [profile, setProfile] = useState(false);

  return (
    <>
      { profile && <EditOrganizer setProfile={setProfile} organizer={user} fetchUser={fetchUser} />}
      <div className="navbar bg-base-100 max-w-[1700px] md:pl-8 mx-auto">
        <div className="navbar-start">
          <Link className="btn btn-ghost normal-case text-xl gap-2" href="/">
            <img src="/img/logo.png" className="w-7" />
            Check-In
          </Link>
        </div>
        { user.active ? (
          <>
            {user.name ? (
              <div className="navbar-end mr-4 xl:mr-10 z-20">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      <img src="/img/default_user.png" />
                    </div>
                  </label>
                  <ul tabIndex={0} className="menu menu-compact dropdown-content p-2 shadow bg-base-100 rounded-box w-52 gap-1">
                    <li className="ml-4 font-semibold mt-1">Hello, {user.name}</li>
                    <li><div onClick={() => setProfile(true)}>Profile</div></li>
                    <li><Link href="/dashboard/">Dashboard</Link></li>
                    <li><div className="btn btn-outline btn-sm items-center" onClick={Logout}>Logout</div></li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
              <div className="navbar-end hidden lg:flex gap-3 justify-end items-center">
                <Link href="/dashboard/" className="btn btn-ghost">Dashboard</Link>
                <Link href="/login" className="btn btn-outline px-6">Login</Link>
                <Link href="/register" className="btn btn-primary px-7">Sign Up</Link>
              </div>
              <div className="navbar-end lg:hidden">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                  </label>
                  <ul tabIndex={0} className="menu menu-compact dropdown-content p-2 shadow bg-base-100 rounded-box w-52 gap-2">
                    <li><Link href="/dashboard/">Dashboard</Link></li>
                    <li><Link className="btn btn-outline btn-sm" href="/login">Login</Link></li>
                    <li><Link className="btn btn-primary btn-sm text-primary-content" href="/register">Signup</Link></li>
                  </ul>
                </div>
              </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="navbar-end mr-4">
              <div role="status">
                <span className="loading loading-dots loading-md"></span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
