import * as dayjs from 'dayjs';
import Datepicker from "react-tailwindcss-datepicker"; 

const EventPicker = ({ setEvent, setEventEdit, events, setEvents, currentEvent, eventHandler, currentMeet, value, setValue, futureEvents }) => {

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
                inputClassName="relative transition-all outline-0 ring-0 duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 bg-white rounded-lg tracking-wide font-light text-sm placeholder-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
                value={value} 
                primaryColor="blue"
                onChange={handleValueChange} 
                showFooter={true} 
                showShortcuts={true} 
                readOnly={true} 
                popoverDirection="down"
            /> 
            <div className='eventMenuScroll max-h-52 overflow-y-auto w-full flex flex-col gap-2'>
                {events.map(event => (
                    <li>
                        <div className={`p-0 text-sm flex justify-between ${event.id === currentEvent?.id ? 'bg-primary text-white' : ''}`}>
                            <div className='p-2 flex-grow' onClick={() => eventHandler(event.id)}>{event.name}</div>
                            <div className='pr-2' onClick={() => {setEventEdit(true);setEvent(event)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="z-10 w-5 h-5 fill-current"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"></path></svg>
                            </div>
                        </div>
                    </li>
                ))}
                { events.length === 0 && <div className='text-sm font-thin text-center' >No events between dates</div>}
                { futureEvents.length > 0 && <div className='font-semibold text-sm px-4 mt-2 -mb-1'>Future Events</div>}
                {futureEvents.map(event => (
                    <li>
                        <div className={`p-0 text-sm flex justify-between ${event.id === currentEvent?.id ? 'bg-primary text-white' : ''}`}>
                            <div className='p-2 flex-grow' onClick={() => eventHandler(event.id)}>{event.name}</div>
                            <div className='pr-2' onClick={() => {setEventEdit(true);setEvent(event)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="z-10 w-5 h-5 fill-current"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"></path></svg>
                            </div>
                        </div>
                    </li>
                ))}
            </div>
        </>
    );
}

export default EventPicker;