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
                const diff = dayjs().diff(startTime);
                setTime(diff);

            }, 1000);
        }
        return () => clearInterval(interval);
    },[isWorking, startTime]);

    const formatTime = () => {
        const durationTime = dayjs.duration(time);

        const hours = String(durationTime.hours()).padStart(2, "0");
        const minutes = String(durationTime.minutes()).padStart(2, "0");
        const seconds = String(durationTime.seconds()).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    };
        return(
            <h1>{formatTime()}</h1>
        );
}
export default WorkTimer;