import {useEffect, useState} from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

function WorkTimer({isWorking, startTime}) {
    const [time, setTime] = useState(0);



    useEffect(() =>{
        let interval;

        if(isWorking && startTime) {
            interval = setInterval(() => {
                const diff = calculateDuration(startTime, dayjs());
                setTime(diff);

            }, 1000);
        }
        return () => clearInterval(interval);
    },[isWorking, startTime]);

    const formatTime = () => {
       return formatDuration(time);

    };
    return (
        <div className="timer-container">
            <div className="timer-circle">
                <span className="timer-icon">🕒</span>
            </div>

            <h1 className="timer-text">{formatTime()}</h1>

            <p className="timer-status">
                {isWorking ? "Work in progress" : "Not working now"}
            </p>
        </div>
    );
}
export default WorkTimer;