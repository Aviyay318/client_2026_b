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