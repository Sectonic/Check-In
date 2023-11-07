import { useRef, useState, useEffect } from 'react';
import { QrReader } from "react-qr-reader";
import db from '@/lib/prisma';
import audio from '@/public/success_sound.mp3';

export const getServerSideProps = async ({ params }) => {
  const currentMeet = await db.meet.findUnique({ where: { id: Number(params.meet_slug) } });
  if (!currentMeet.qr) {
    return { redirect: { destination: '/dashboard/' + params.meet_slug, permanent: true } };
  }
  return { props: { meet: params.meet_slug }};
}

export default function QR({ meet }) {
  const success_audio = new Audio(audio);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const messageData = useRef(null);
  const messageType = useRef(null);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateWindowWidth);

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  const getResult = async (qrId) => {
    if (!messageData.current.innerHTML.includes(qrId)) {
      messageData.current.innerHTML = 'Scanning...';

      const data = {
        attendeeId: qrId,
        meetId: Number(meet)
      }
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }
      const response = await fetch('/api/post/attendance/qr', options);
      const responseData = await response.json();
      if (response.ok && responseData.message.split("@")[0] !== "You have already submitted attendance ") {
        success_audio.play();
      }
      messageType.current.className = `alert mb-3 justify-start ${response.ok ? 'alert-success' : 'alert-error'}`;
      messageData.current.innerHTML = responseData.message;
  
      setTimeout(() => {
        if (messageData.current && messageData.current.innerHTML === responseData.message) {
          messageData.current.innerHTML = "No Input";
          messageType.current.className = "alert mb-3 justify-start";
        }
      }, 1500)
    }
  }

  return (
    <>
      <div className="alert mb-3" ref={messageType}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span ref={messageData}>No Input</span>
      </div>
      <QrReader
        onResult={(result) => {
          if (!!result) {
            getResult(result.text);
          }
        }}
        videoContainerStyle={{paddingTop: 0, overflow: 'inherit', height: windowWidth < 1110 ? '' : `calc(100vh - 175px)`}}
        videoStyle={{borderRadius: 20, position: windowWidth < 1110 ? 'relative' : 'absolute', height: windowWidth < 1110 ? '' : `calc(100vh - 175px)`}}
        ViewFinder={() => (
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 w-[100%] max-[1110px]:rounded-xl  min-[1110px]:w-[109vh] h-full overflow-hidden'>
            <div className='z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[150px] w-[150px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] qr_outline ring-[10000px] ring-black/60 rounded-lg'>
              <div className='absolute -top-7 text-white text-center w-full'>Scan here</div>
            </div>
          </div>
        )}
      />
    </>
  )
}