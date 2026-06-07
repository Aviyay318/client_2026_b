import {useEffect, useState} from "react";
import NavbarEmployee from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import {getWorkShiftsForEmployee} from "../../service/workShiftsApi.js";
import "./EmployeeViewPages.css";

const extractShifts = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.shifts ?? payload?.workShifts ?? payload?.finalShifts ?? payload?.placements ?? [];
};

const valueOf = (shift, keys) => {
    for (const key of keys) {
        if (shift?.[key] !== undefined && shift[key] !== null && shift[key] !== "") {
            return shift[key];
        }
    }

    return "-";
};

function EmployeeFinalShiftsPage() {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadFinalShifts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getWorkShiftsForEmployee();
                const payload = response?.data?.data ?? response?.data ?? {};

                if (isMounted) {
                    setShifts(extractShifts(payload));
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || "Could not load final shifts.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadFinalShifts();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="employee-view-page">
            <NavbarEmployee active="FinalShifts" />

            <header className="employee-view-header" dir="rtl">
                <p className="employee-view-kicker">Employee View</p>
                <h1>משמרות סופיות</h1>
                <p>רשימת המשמרות הסופיות ששובצת אליהן.</p>
            </header>

            {error && <section className="employee-view-error">{error}</section>}

            {loading ? (
                <section className="employee-view-state">Loading final shifts...</section>
            ) : shifts.length === 0 ? (
                <section className="employee-view-empty" dir="rtl">
                    <h2>אין משמרות סופיות להצגה</h2>
                    <p>ברגע שיתפרסם שיבוץ סופי, הוא יופיע כאן.</p>
                </section>
            ) : (
                <section className="final-shifts-panel">
                    <table className="final-shifts-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Location</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {shifts.map((shift, index) => (
                            <tr key={shift.id ?? shift.shiftId ?? shift.shift_id ?? index}>
                                <td>{valueOf(shift, ["date", "shiftDate", "dayDate"])}</td>
                                <td>{valueOf(shift, ["day", "dayName"])}</td>
                                <td>{valueOf(shift, ["startHour", "startTime", "start"])}</td>
                                <td>{valueOf(shift, ["endHour", "endTime", "end"])}</td>
                                <td>{valueOf(shift, ["location", "siteName", "site", "workSite"])}</td>
                                <td>{valueOf(shift, ["role", "position", "jobRole"])}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            )}
        </div>
    );
}

export default EmployeeFinalShiftsPage;
