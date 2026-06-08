import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function calculateDuration(start, end) {
    return dayjs(end).diff(dayjs(start));
}

export function formatDuration(ms) {
    const d = dayjs.duration(ms);
    const hours = String(d.hours()).padStart(2, "0");
    const minutes = String(d.minutes()).padStart(2, "0");
    const seconds = String(d.seconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}
export function calculateTotalHours(rows){
   return  rows.reduce((sum, row) => {
       return  sum + calculateDuration(
            row.enterTime ,
            row.exitTime
        )
    },0);

}
export function formatTimeForServer(time) {
    const [hours, minutes] = time.split(":");

    return dayjs()
        .hour(Number(hours))
        .minute(Number(minutes))
        .second(0)
        .format("YYYY-MM-DD HH:mm:ss");
}

export function formatTimeForInput(time) {
    if (!time) {
        return "";
    }

    const timeMatch = time.match(/(?:T|^)(\d{2}:\d{2})/);
    return timeMatch?.[1] ?? "";
}
