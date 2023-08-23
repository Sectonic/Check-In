import Link from "next/link"

export default function TopNav({ user, Logout }) {
  return (
    <div className="navbar bg-base-100 max-w-[1700px] mx-auto">
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
                  <li><Link href="/dashboard/">Dashboard</Link></li>
                  <li><div>Organizations</div></li>
                  <li><div className="btn btn-outline btn-sm items-center" onClick={Logout}>Logout</div></li>
                </ul>
              </div>
            </div>
          ) : (
            <>
            <div className="navbar-end hidden lg:flex">
              <ul className="menu menu-horizontal gap-3 px-1">
                <li><div>Organizations</div></li>
                <li><Link href="/dashboard/">Dashboard</Link></li>
                <li><Link href="/login" className="btn btn-outline">Login</Link></li>
                <li><Link href="/register" className="btn btn-primary text-primary-content">Sign Up</Link></li>
              </ul>
            </div>
            <div className="navbar-end lg:hidden">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content p-2 shadow bg-base-100 rounded-box w-52 gap-2">
                  <li><Link href="/dashboard/">Dashboard</Link></li>
                  <li><div>Organizations</div></li>
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
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-base-300 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
