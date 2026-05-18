import dayjs from "dayjs";
import { calculateDuration, formatDuration } from "../utils/timeUtils.js";
import "./WorkHoursTable.css";

function WorkHoursTable({ rows }) {
    return (
        <div className="table-area">
            <table className="work-hours-table">
                <thead>
                <tr>
                    <th>📅 Date</th>

                    <th className="start-head">
                        <span className="start-icon">◷</span>
                        <span className="head-text">Start</span>
                    </th>

                    <th className="end-head">
                        <span className="end-icon">◷</span>
                        <span className="head-text">End</span>
                    </th>

                    <th className="location-head">
                        <span className="location-icon-table">
                            <svg
                                className="location-pin-svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                            </svg>
                        </span>
                        <span className="head-text">Location</span>
                    </th>

                    <th className="total-head">
                        <span className="total-icon-table">◷</span>
                        <span className="head-text">Total</span>
                    </th>
                </tr>
                </thead>

                <tbody>
                {rows.length > 0 ? (
                    rows.map((row, index) => {
                        const total = calculateDuration(row.enterTime, row.exitTime);
                        const rowDisplay = row.status === "ABSENCE";

                        return (
                            <tr key={index} className={rowDisplay ? "sick-row" : ""}>
                                <td className="date-cell">
                                    {rowDisplay && (
                                        <div className="absence-badge">
                                            {row.absenceReason || "----"}
                                        </div>
                                    )}
                                    <div>📅 {dayjs(row.enterTime).format("DD/MM/YYYY")}</div>
                                </td>

                                <td className="start-time">
                                    {rowDisplay ? "-----" : dayjs(row.enterTime).format("HH:mm")}
                                </td>

                                <td className="end-time">
                                    {rowDisplay ? "-----" : (row.exitTime ? dayjs(row.exitTime).format("HH:mm") : "--:--")}
                                </td>

                                <td>
                                    {rowDisplay ? "-----" : (row.enterLocation ? row.enterLocation : (row.enterSite?.name || "----"))}
                                </td>

                                <td className="total-time">
                                    {rowDisplay ? "00:00" : formatDuration(total)}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td className="no-data" colSpan="5">
                            אין נתונים
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default WorkHoursTable;