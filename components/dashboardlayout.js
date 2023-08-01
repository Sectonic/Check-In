import SideNav from './sidenav';
import CreateMeet from './popups/create_meet';
import { useRouter } from 'next/router';
import { Children, useState } from 'react';
import MeetSettings from './popups/meet_settings';

export function DashboardLayout({ page, meets, fetchMeets, currentMeet, children}) {
    const router = useRouter();
    const [create, setCreate] = useState(false);
    const [settings, setSettings] = useState(false);
    const children_arr = Children.toArray(children);

    return (
        <>
            { create && <CreateMeet setCreate={setCreate} fetchMeets={fetchMeets} />}
            { settings && <MeetSettings setSettings={setSettings} fetchMeets={fetchMeets} meet={currentMeet} />}
            <div className={router.query.meet_slug ? 'ml-[396px]' : 'ml-[96px]'}>
                {children_arr[0]}
                <SideNav page={page} router={router} setCreate={setCreate} setSettings={setSettings} meets={meets} currentMeetInfo={currentMeet} />
                {children_arr[1]}
            </div>
        </>
    )
}