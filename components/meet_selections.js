import { useState, Children, cloneElement } from "react";

export const Date = ({ abr, num, active, dateSelect }) => {

    const classActive = `w-8 h-8 ${active ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'} rounded-full flex justify-center items-center cursor-pointer`;
    
    return (
        <div className="basis-[11.2857143%] flex justify-center items-center flex-col">
            { abr && <div className="font-semibold text-center">{abr}</div>}
            <div className={classActive} onClick={() => {dateSelect(num)}}>
                {num}
            </div>
        </div>
    )
}

export const DatePicker = ({ children, setDates, dates}) => {

    const dateSelect = (num) => {
        if (dates.includes(num)) {
            setDates(dates.map(date => {
                if (date != num) {
                    return date;
                }
            }))
        } else {
            setDates(prev => [...prev, num]);
        }
    }

    return (
        <div className="flex justify-center flex-wrap gap-3 mt-2">
            {Children.map(children, child => {
                if (dates.includes(child.props.num)) {
                    return cloneElement(child, {active: true, dateSelect})
                } else {
                    return cloneElement(child, {active: false, dateSelect})
                }
            })}
        </div>
    )
}

export const TypeButton = ({ type, desc, active, typeHandler }) => {
    const classActive = `btn w-24 ${active ? 'btn-primary' : 'btn-ghost'}`;
    return <button type="button" className={classActive} onClick={() => typeHandler(type, desc)}>{type}</button>
}

export const TypePicker = ({ children, type, setType, reoccuringHandler }) => {
    const [desc, setDesc] = useState(Children.toArray(children)[0].props.desc);

    const typeHandler = (newType, newDesc) => {
        if (newType === 'Manual') {
            reoccuringHandler({ target: { checked: false }});
        }
        setDesc(newDesc);
        setType(newType);
    }

    return (
        <>
            <div className="mt-1 flex justify-start gap-2">
                {Children.map(children, child => {
                    if (child.props.type === type) {
                        return cloneElement(child, {active: true, typeHandler}) 
                    } else {
                        return cloneElement(child, {active: false, typeHandler}) 
                    }
                })}
            </div>
            <div className="ml-1 mt-1 font-semibold">{type} type</div>
            <div className="ml-1 text-sm">
                {desc}
            </div>
            <div className="bg-base-200 p-2 rounded-lg mt-2 text-xs">
                    *Every attendance type has the option to manually change attendance. With form and QR code, you are given more options.
            </div>
        </>
    )
}

export const TimeDropdownSlot = ({ type, list, selected, timeHandler }) => {
    return (
        <div className="overflow-y-scroll scrollbar-hide flex items-center flex-col gap-2 p-2">
            {list.map(item => {
                const classActivity = `w-full p-2 ${selected === item ? 'bg-primary text-primary-content' : 'bg-base-200'} font-semibold rounded-lg cursor-pointer`
                return (
                    <div className={classActivity} onClick={() => timeHandler(type, item)}>
                        {item}
                    </div>
                )
            })}
        </div>
    )
}

export const TimeDropdown = ({ time, setTime }) => {

    const hours = Array.from({length: 12}, (_, i) => i + 1);
    const minutes = [...Array(60).keys()];
    const times = ['AM', 'PM'];

    const timeHandler = (type, newSelect) => {
        if (type === 'hour') {
            setTime({...time, hour: newSelect})
        } else if (type === 'minute') {
            setTime({...time, minute: newSelect})
        } else {
            setTime({...time, time: newSelect})
        }
    }


    return (
        <div tabIndex={0} className="mt-1 dropdown-content p-2 shadow bg-base-100 rounded-box w-52">
            <div className="grid grid-cols-3 h-48 text-center">
                <TimeDropdownSlot list={hours} selected={time.hour} type="hour" timeHandler={timeHandler} />
                <TimeDropdownSlot list={minutes} selected={time.minute} type="minute" timeHandler={timeHandler} />
                <TimeDropdownSlot list={times} selected={time.time} type="time" timeHandler={timeHandler} />
            </div>
        </div>
    )
}

export const TimePicker = ({ label, time, setTime, value, reoccuring, position}) => {
    return (
        <div className={`dropdown dropdown-bottom ${position && 'dropdown-' + position}`}>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <label tabIndex={0}>
                <div className="form-control w-full max-w-xs">
                    <input value={value} type="input" placeholder="Type here" className="input input-bordered w-full max-w-xs cursor-pointer" disabled={reoccuring ? '' : 'disabled'} readOnly />
                </div>
            </label>
            {reoccuring && (
                <TimeDropdown time={time} setTime={setTime} />
            )}
        </div>
    )
}