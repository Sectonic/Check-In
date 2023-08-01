import { useRef } from 'react';
import { QrReader } from "react-qr-reader";

export const getServerSideProps = ({ params }) => {
  return { props: { meet: params.meet_slug }}
}

export default function QR({ meet }) {
  const messageData = useRef(null);
  const messageType = useRef(null);

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
      messageType.current.className = `alert mb-3 justify-start ${response.ok ? 'alert-success' : 'alert-error'}`;
      messageData.current.innerHTML = responseData.message;
  
      setTimeout(() => {
        if (messageData.current.innerHTML === responseData.message) {
          messageData.current.innerHTML = "No Input";
          messageType.current.className = "alert mb-3 justify-start";
        }
      }, 3000)
    }
  }

  return (
    <>
      <div className="alert mb-3 justify-start" ref={messageType}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span ref={messageData}>No Input</span>
      </div>
      <QrReader
        onResult={(result) => {
          if (!!result) {
            getResult(result.text);
          }
        }}
        videoContainerStyle={{paddingTop: 0}}
        videoStyle={{borderRadius: 20, position: 'relative', width: '100%', padding: 0}}
        ViewFinder={() => (
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 w-full h-full'>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-[45%] border'>
              <div className='absolute -top-7 text-white text-center w-full'>Scan here</div>
            </div>
          </div>
        )}
      />
    </>
  )
}