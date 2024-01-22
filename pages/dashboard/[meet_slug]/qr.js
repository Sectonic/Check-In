import { useRef, useState, useEffect } from 'react';
import { QrReader } from "react-qr-reader";
import audio from '@/public/success_sound.mp3';
import Image from 'next/image';
import ManualAttendance from '@/components/popups/manual_attendance';

export const getServerSideProps = async ({ params }) => {
  return { props: { meet: params.meet_slug }};
}

export default function QR({ meet }) {
  const success_audio = new Audio(audio);
  const [fullscreen, setFullScreen] = useState(false);
  const [manual, setManual] = useState(false);
  const messageData = useRef(null);
  const messageOverlay = useRef(null);

  const changeEventColor = (color) => `z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[150px] w-[150px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] qr_outline-${color} ring-[10000px] ring-black/70 rounded-lg`;
  const changeEventTitleColor = (color) => `absolute -top-9 text-${color} text-center text-xl font-semibold w-full`;

  const changeFullScreen = (value) => {

    setFullScreen(value);

    if (value) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }

  }

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
      const response = await fetch('/api/post/attendance', options);
      const responseData = await response.json();
      if (response.ok && responseData.message !== "Already submitted") {
        success_audio.play();
      }

      messageData.current.className = changeEventTitleColor(response.ok ? 'success' : 'error');
      messageOverlay.current.className = changeEventColor(response.ok ? 'green' : 'red');

      messageData.current.innerHTML = responseData.message + " @" + responseData.id;
  
      setTimeout(() => {
        if (messageData.current && messageData.current.innerHTML === responseData.message + " @" + responseData.id) {
          messageData.current.innerHTML = "No Input";
          messageData.current.className = changeEventTitleColor('white');
          messageOverlay.current.className = changeEventColor('white');
        }
      }, 1500)
    }
  }

  return (
    <div className={fullscreen ? 'absolute w-full h-full top-0 left-0 bg-black z-50' : ''}>
      { manual && <ManualAttendance setManual={setManual} success_audio={success_audio} meet={meet} /> }
      <QrReader
        onResult={(result) => {
          if (!!result) {
            getResult(result.text);
          }
        }}
        videoContainerStyle={{paddingTop: 0, overflow: 'inherit', height: `calc(100vh - ${fullscreen ? 0 : 115}px)`, backgroundColor: 'black', borderRadius: 20 }}
        videoStyle={{borderRadius: 20, position: 'absolute', height: `calc(100vh - ${fullscreen ? 0 : 115}px)`}}
        ViewFinder={() => (
          <>
            <div className='absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-3 justify-center items-start z-30 w-[100%] max-[1110px]:rounded-xl  min-[1110px]:w-[109vh] overflow-hidden'>
              <div className='absolute top-0 right-4 p-2 transition hover:bg-primary-content bg-white rounded-full cursor-pointer' onClick={() => changeFullScreen(!fullscreen)}>
                <Image
                    className='w-[25px] h-[25px] mx-auto'
                    src={fullscreen ? "/img/compress.png" : "/img/expand.png"}
                    height={0}
                    width={0}
                    sizes="100vw"
                />
              </div>
              <div className='p-3 rounded-xl w-[160px] bg-white text-center transition hover:bg-primary-content cursor-pointer'>
                <div>Don't have a code?</div>
                <img src='/img/add.png' className='my-1 w-[35px] h-[35px] mx-auto' />
                <div className='font-semibold'>Create one</div>
              </div>
              <div className='p-3 rounded-xl bg-white'>
                <div>
                  <Image
                    className='w-[75px] h-[75px] mx-auto'
                    src="/img/scanning.gif"
                    height={0}
                    width={0}
                    sizes="100vw"
                  />
                </div>
                <div className='text-lg font-semibold'>Scan your QR Code</div>
              </div>
              <div className='p-3 rounded-xl w-[160px] bg-white text-center transition hover:bg-primary-content cursor-pointer' onClick={() => setManual(true)}>
                <div>Forgot to bring it?</div>
                <img src='/img/keyboard-down.png' className='my-1 w-[35px] h-[35px] mx-auto' />
                <div className='font-semibold'>Manually Input</div>
              </div>
            </div>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 w-[100%] max-[1110px]:rounded-xl h-full overflow-hidden rounded-[20px]'>
              <div ref={messageOverlay} className={`z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[150px] w-[150px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] qr_outline-white ring-[10000px] ring-black/70 rounded-lg`}>
                <div className={`absolute -top-9 text-white text-center text-xl font-semibold w-full`} ref={messageData}>No Input</div>
              </div>
            </div>
          </>
        )}
      />
    </div>
  )
}