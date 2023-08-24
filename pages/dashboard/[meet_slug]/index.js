import * as dayjs from 'dayjs';
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker"; 
import { AttendanceRates, AttendanceSubmitted, OverallAttendance } from '@/components/charts';
import { useRouter } from 'next/router';

export default function Overview({ currentMeet }) {
  const router = useRouter();

  const [graphPoints, setGraphPoints] = useState([]);
  const [minutePoints, setMinutePoints] = useState([]);
  const [piePoints, setPiePoints] = useState([]);
  const [value, setValue] = useState({ 
    startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'), 
    endDate:  dayjs().add(1, 'day').format('YYYY-MM-DD')
  });

  const getData = async (startTime, endTime) => {
    const request = await fetch('/api/get/overview?' + new URLSearchParams({ startTime, endTime, meetId: router.query.meet_slug }));
    if (request.ok) {
      const data = await request.json();
      setGraphPoints(data.graphPoints);
      setMinutePoints(data.minutePoints);
      setPiePoints(data.piePoints);
      if (data.newStartTime) {
        setValue({ startDate: data.newStartTime, endDate: value.endDate });
      }
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    getData(dayjs(value.startDate).unix(), dayjs(value.endDate).unix());
  }, [router.query.meet_slug]);

  const valueHandler = async ({ startDate, endDate }) => {
    await getData(dayjs(startDate).unix(), dayjs(endDate).unix());
    setValue({ startDate, endDate });
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">{currentMeet.name} Overview</h1>
      <div className="w-80 mt-3">
        <Datepicker 
            inputClassName="relative transition-all border border-2 outline-0 ring-0 duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
            value={value} 
            onChange={valueHandler} 
            showFooter={true} 
            showShortcuts={true} 
            readOnly={true} 
            popoverDirection="down"
        /> 
      </div>
      <hr className="my-3"/>
      <AttendanceRates data={graphPoints} />
      <div className='flex max-xl:flex-col justify-center gap-2 p-2'>
        <AttendanceSubmitted data={minutePoints} />
        <OverallAttendance data={piePoints} />
      </div>
    </>
  )
}