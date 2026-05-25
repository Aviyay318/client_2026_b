import "./WorkHoursTable.css";
import "./ShiftsTable.css";

function ShiftsTable({ shifts }) {
    return (
        <div className="table-area shifts-table-area">
            <table className="work-hours-table shifts-table">
                <thead>
                <tr>
                    <th className="shift-day-head">
                        <span className="shift-head-icon">▦</span>
                        <span className="head-text">Day</span>
                    </th>

                    <th>
                        <span className="shift-date-icon">📅</span>
                        <span className="head-text">Date</span>
                    </th>

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

                    <th className="shift-role-head">
                        <span className="shift-role-icon">▣</span>
                        <span className="head-text">Role</span>
                    </th>
                </tr>
                </thead>

                <tbody>
                {shifts.length > 0 ? (
                    shifts.map((shift, index) => (
                        <tr key={index}>
                            <td>{shift.day}</td>
                            <td>{shift.date}</td>
                            <td className="start-time">{shift.startHour}</td>
                            <td className="end-time">{shift.endHour}</td>
                            <td>{shift.location}</td>
                            <td>{shift.role}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td className="no-data shifts-no-data" colSpan="6">
                            אין משמרות להצגה
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default ShiftsTable;