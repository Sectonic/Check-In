import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/dashboardlayout';
import { useEffect, useState } from 'react';
import TopNav from '@/components/topnav';

export default function App({ Component, pageProps}) {
  const router = useRouter();
  const [user, setUser] = useState({active: false});
  const [meets, setMeets] = useState(null);
  const [currentMeet, setCurrentMeet] = useState(null);

  const fetchMeets = async () => {
    const meetsRes = await fetch('/api/get/meets');
    const meetsData = await meetsRes.json();
    setMeets(meetsData.meets);
  }

  const fetchUser = async () => {
    const userRes = await fetch('/api/get/user');
    const userData = await userRes.json();
    setUser(userData);
  }

  const Logout = async () => {
    await fetch('/api/get/logout');
    setUser({active:true});
    router.push('/');
  }

  useEffect(() => {
    async function getProps() {
      const userRes = await fetch('/api/get/user');
      const userData = await userRes.json();
      setUser(userData);
      if (userData.name) {
        await fetchMeets();
      }
    }
    getProps();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.meet_slug && router.pathname.includes('dashboard')) { 
      var dashboardPage = router.pathname.split('/').at(-1);
      if (dashboardPage !== 'dashboard' && dashboardPage !== 'qr') {
        router.back(); 
        return;
      }
    }
    const getMeet = async () => {
      const currentMeetRes = await fetch('/api/get/meet?meetId=' + router.query.meet_slug);
      const currentMeetData = await currentMeetRes.json();
      setCurrentMeet(currentMeetData.meet || null);
    }
    if (currentMeet?.id !== router.query.meet_slug && router.query.meet_slug) {
      getMeet();
    }
  }, [router.query.meet_slug])

  if (router.pathname.includes('dashboard')) {
    var dashboardPage = router.pathname.split('/').at(-1);
    if (dashboardPage === '[meet_slug]') {
      dashboardPage = '';
    }
    const notInMeet = dashboardPage === 'dashboard';

    return (
      <DashboardLayout page={dashboardPage} meets={meets} fetchMeets={fetchMeets} currentMeet={currentMeet}>
        <TopNav user={user} Logout={Logout} fetchUser={fetchUser} />
        <div className='p-6 mx-auto max-w-[1700px]'>
            {currentMeet || notInMeet || dashboardPage == 'qr' ? (
              <Component {...pageProps} currentMeet={currentMeet} />
            ) : (
              <div className='flex justify-center items-center h-[calc(100vh-150px)]'>
                <div className='mx-auto' role="status">
                  <span className="loading loading-dots loading-md"></span>
                </div>
              </div>
            )}
        </div>
      </DashboardLayout>
    )
  } else {
    return (
      <>
        <TopNav user={user} Logout={Logout} fetchUser={fetchUser}  />
        <div className='p-6 mx-auto'>
          <Component {...pageProps} fetchUser={fetchUser} fetchMeets={fetchMeets} />
        </div>
      </>
    )
  }
}
