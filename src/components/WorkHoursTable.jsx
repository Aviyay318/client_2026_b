import dayjs from "dayjs";
import { calculateDuration, formatDuration } from "../utils/TimeUtils.js";
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

                        return (
                            <tr key={index}>
                                <td>📅 {dayjs(row.enterTime).format("DD/MM/YYYY")}</td>
                                <td className="start-time">
                                    {dayjs(row.enterTime).format("HH:mm")}
                                </td>
                                <td className="end-time">
                                    {dayjs(row.exitTime).format("HH:mm")}
                                </td>
                                <td className="total-time">
                                    {formatDuration(total)}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td className="no-data" colSpan="4">
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