import * as dayjs from 'dayjs';
import Datepicker from "react-tailwindcss-datepicker"; 

const EventPicker = ({ events, setEvents, currentEvent, eventHandler, currentMeet, value, setValue }) => {

    const handleValueChange = async (newValue) => {
        if (newValue.startDate) {
            const startTime = dayjs(newValue.startDate).unix();
            const endTime = dayjs(newValue.endDate).unix();
            const params = new URLSearchParams({ startTime, endTime, meetId: currentMeet.id });
            const eventReq = await fetch('/api/get/events?' + params);
            const eventData = await eventReq.json();
            setEvents(eventData.events);
            setValue(newValue); 
        }
    }

    return (
        <>  
            <div className='font-semibold text-sm px-4 -mb-3'>Events between</div>
            <Datepicker 
                inputClassName="relative transition-all outline-0 ring-0 duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                value={value} 
                onChange={handleValueChange} 
                showFooter={true} 
                showShortcuts={true} 
                readOnly={true} 
            /> 
            <div className='eventMenuScroll max-h-52 overflow-y-scroll w-full flex flex-col gap-2'>
                {events.map(event => (
                    <li><a className={`text-sm ${event.id === currentEvent.id ? 'bg-primary text-white' : ''}`} onClick={() => eventHandler(event.id)}>{event.name}</a></li>
                ))}
            </div>
            {events.length === 0 && <div className='text-sm font-thin text-center' >No events between dates</div>}
        </>
    );
}

export default EventPicker;