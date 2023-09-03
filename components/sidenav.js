import Link from 'next/link';

export default function SideNav({ page, router, setCreate, meets, currentMeetInfo, setSettings }) {
    const currentMeet = meets ? meets.find(meet => meet.id == Number(router.query.meet_slug)) : null;

    const setActive = current => {
        if (current === page) {
            return "active active-primary";
        } else {
            return "";
        }
    }

    const setLink = (page) => {
        return '/dashboard/' + encodeURIComponent(router.query.meet_slug) + "/" + page;
    }
    
    return (
        <div className="sm:fixed top-0 left-0 h-full sm:flex">
            <Link href="/dashboard/" className={`${page === "dashboard" ? "max-sm:hidden" : ""} sm:hidden mx-6 my-1 btn btn-ghost flex justify-start items-center gap-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </Link>
            <div className={`${page === "dashboard" ? "max-sm:hidden" : ""} sm:hidden ml-6 text-2xl font-semibold`}>
                Meets
            </div>
            <ul className={`${page === "dashboard" ? "max-sm:hidden" : ""} max-sm:flex max-sm:w-full max-sm:overflow-x-auto items-center justify-start sm:menu max-sm:menu-horizontal gap-1 bg-base-100 max-sm:py-2 max-sm:px-6 sm:p-4 sm:border-r`}>
                <li className="max-sm:hidden rounded-full">
                    <Link href="/dashboard/" className='flex justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </Link>
                </li>
                <hr/>
                {meets && meets.map((meet, i) => {
                    return (
                        <Link href={`/dashboard/${meet.id}/`} key={i}>
                            <li className="rounded-xl">
                                <div className="tooltip tooltip-right p-2 z-20" data-tip={meet.name}>
                                    {meet.image ? <div className='w-11 h-11 sm:w-12 sm:h-12'><img className="mask mask-circle w-full h-full object-cover" src={meet.image} /></div> : (
                                        <div className="avatar placeholder">
                                            <div className="bg-base-200 text-base-content rounded-full w-12">
                                                <span className="text-2xl">{meet.name.substring(0,1).toUpperCase()}{meet.name.substring(1,2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        </Link>
                    )
                })}
                <li className="rounded-xl group cursor-pointer" onClick={() => setCreate(true)}>
                    <div className="avatar placeholder p-2">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 group-active:border-white border-base-content border-dashed">
                        <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" className='h-[25px] w-[25px] fill-current' version="1.1" id="Capa_1" viewBox="0 0 48.467 48.467" space="preserve">
                            <g><g><path d="M0.001,24.233c0,3.584,2.916,6.5,6.5,6.5h11.234v11.234c0,3.584,2.916,6.5,6.5,6.5    s6.5-2.916,6.5-6.5V30.733h11.232c3.584,0,6.5-2.916,6.5-6.5s-2.916-6.5-6.5-6.5H30.736V6.5c0-3.584-2.916-6.5-6.5-6.5    s-6.5,2.916-6.5,6.5v11.233H6.501C2.917,17.733,0.001,20.649,0.001,24.233z M18.236,20.733c1.379,0,2.5-1.122,2.5-2.5V6.5    c0-1.93,1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5v11.733c0,1.378,1.121,2.5,2.5,2.5h11.732c1.93,0,3.5,1.57,3.5,3.5s-1.57,3.5-3.5,3.5    H30.236c-1.379,0-2.5,1.122-2.5,2.5v11.734c0,1.93-1.57,3.5-3.5,3.5s-3.5-1.57-3.5-3.5V30.233c0-1.378-1.121-2.5-2.5-2.5H6.501    c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5H18.236z"/></g></g></svg>
                        </div>
                    </div>
                </li>
            </ul>
            {router.query.meet_slug && (
                <div className="max-sm:px-5 sm:border-r w-full sm:w-[285px]">
                    <div className="p-5 flex justify-between gap-4 items-center border-b">
                        { currentMeet ? (
                            <>  
                                <div className='flex justify-start gap-4'>
                                    {currentMeet.image ? (
                                        <div className="avatar">
                                            <div className="w-12 rounded-full">
                                                <img src={currentMeet.image} />
                                            </div>
                                        </div>
                                        ) : (
                                        <div className="avatar placeholder">
                                            <div className="bg-base-200 text-base-content rounded-full w-12">
                                                <span className="text-2xl">{currentMeet.name.substring(0,1).toUpperCase()}{currentMeet.name.substring(1,2)}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold">{currentMeet.name}</div>
                                        <p className="text-xs">{currentMeet.organizer.name}</p>
                                    </div>
                                </div>
                                <div>
                                    <div onClick={() => setSettings(true)}>
                                        <div className="btn btn-square btn-ghost" >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current cursor-pointer" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12.0002 8C9.79111 8 8.00024 9.79086 8.00024 12C8.00024 14.2091 9.79111 16 12.0002 16C14.2094 16 16.0002 14.2091 16.0002 12C16.0002 9.79086 14.2094 8 12.0002 8ZM10.0002 12C10.0002 10.8954 10.8957 10 12.0002 10C13.1048 10 14.0002 10.8954 14.0002 12C14.0002 13.1046 13.1048 14 12.0002 14C10.8957 14 10.0002 13.1046 10.0002 12Z"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.2867 0.5C9.88583 0.5 8.6461 1.46745 8.37171 2.85605L8.29264 3.25622C8.10489 4.20638 7.06195 4.83059 6.04511 4.48813L5.64825 4.35447C4.32246 3.90796 2.83873 4.42968 2.11836 5.63933L1.40492 6.83735C0.67773 8.05846 0.954349 9.60487 2.03927 10.5142L2.35714 10.7806C3.12939 11.4279 3.12939 12.5721 2.35714 13.2194L2.03927 13.4858C0.954349 14.3951 0.67773 15.9415 1.40492 17.1626L2.11833 18.3606C2.83872 19.5703 4.3225 20.092 5.64831 19.6455L6.04506 19.5118C7.06191 19.1693 8.1049 19.7935 8.29264 20.7437L8.37172 21.1439C8.6461 22.5325 9.88584 23.5 11.2867 23.5H12.7136C14.1146 23.5 15.3543 22.5325 15.6287 21.1438L15.7077 20.7438C15.8954 19.7936 16.9384 19.1693 17.9553 19.5118L18.3521 19.6455C19.6779 20.092 21.1617 19.5703 21.8821 18.3606L22.5955 17.1627C23.3227 15.9416 23.046 14.3951 21.9611 13.4858L21.6432 13.2194C20.8709 12.5722 20.8709 11.4278 21.6432 10.7806L21.9611 10.5142C23.046 9.60489 23.3227 8.05845 22.5955 6.83732L21.8821 5.63932C21.1617 4.42968 19.678 3.90795 18.3522 4.35444L17.9552 4.48814C16.9384 4.83059 15.8954 4.20634 15.7077 3.25617L15.6287 2.85616C15.3543 1.46751 14.1146 0.5 12.7136 0.5H11.2867ZM10.3338 3.24375C10.4149 2.83334 10.7983 2.5 11.2867 2.5H12.7136C13.2021 2.5 13.5855 2.83336 13.6666 3.24378L13.7456 3.64379C14.1791 5.83811 16.4909 7.09167 18.5935 6.38353L18.9905 6.24984C19.4495 6.09527 19.9394 6.28595 20.1637 6.66264L20.8771 7.86064C21.0946 8.22587 21.0208 8.69271 20.6764 8.98135L20.3586 9.24773C18.6325 10.6943 18.6325 13.3057 20.3586 14.7523L20.6764 15.0186C21.0208 15.3073 21.0946 15.7741 20.8771 16.1394L20.1637 17.3373C19.9394 17.714 19.4495 17.9047 18.9905 17.7501L18.5936 17.6164C16.4909 16.9082 14.1791 18.1618 13.7456 20.3562L13.6666 20.7562C13.5855 21.1666 13.2021 21.5 12.7136 21.5H11.2867C10.7983 21.5 10.4149 21.1667 10.3338 20.7562L10.2547 20.356C9.82113 18.1617 7.50931 16.9082 5.40665 17.6165L5.0099 17.7501C4.55092 17.9047 4.06104 17.714 3.83671 17.3373L3.1233 16.1393C2.9058 15.7741 2.97959 15.3073 3.32398 15.0186L3.64185 14.7522C5.36782 13.3056 5.36781 10.6944 3.64185 9.24779L3.32398 8.98137C2.97959 8.69273 2.9058 8.2259 3.1233 7.86067L3.83674 6.66266C4.06106 6.28596 4.55093 6.09528 5.0099 6.24986L5.40676 6.38352C7.50938 7.09166 9.82112 5.83819 10.2547 3.64392L10.3338 3.24375Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className='mx-auto' role="status">
                                <span className="loading loading-dots loading-md"></span>
                            </div>
                        ) }
                    </div>
                    <ul className="menu gap-2 bg-base-100 p-3 rounded-box">
                        <li>
                            <Link className={setActive('')} href={setLink('')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            Overview
                            </Link>
                        </li>
                        <li>
                            <Link className={setActive('attendance')} href={setLink('attendance')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                Attendance Sheet
                            </Link>
                        </li>
                        { currentMeetInfo && (!currentMeetInfo.qr && !currentMeetInfo.manual) && (
                            <li>
                                <Link className={setActive('customize')} href={setLink('customize')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    Form Customizer
                                </Link>
                            </li>
                        )}
                        { currentMeetInfo && (currentMeetInfo.qr) && (
                            <li>
                                <Link className={setActive('qr')} href={setLink('qr')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    QR Scanner
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link className={setActive('attendees')} href={setLink('attendees')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Attendees
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}