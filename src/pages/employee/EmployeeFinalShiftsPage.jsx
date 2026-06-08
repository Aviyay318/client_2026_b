import {useEffect, useState} from "react";
import NavbarEmployee from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import {getWorkShiftsForEmployee} from "../../service/workShiftsApi.js";
import {getPublishedShifts} from "../../service/employeeConstraintsApi.js";
import "./EmployeeViewPages.css";

const extractShifts = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.shifts ?? payload?.workShifts ?? payload?.finalShifts ?? payload?.placements ?? [];
};

const getServerErrorMessage = (payload, fallback) => {
    if (payload?.message) {
        return payload.message;
    }

    if (payload?.errorCode) {
        return `${fallback} Error code: ${payload.errorCode}`;
    }

    return fallback;
};

const valueOf = (shift, keys) => {
    for (const key of keys) {
        if (shift?.[key] !== undefined && shift[key] !== null && shift[key] !== "") {
            return shift[key];
        }
    }

    return "-";
};

const weekDays = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday",
};

const getShiftId = (shift) => shift?.shiftId ?? shift?.shift_id ?? shift?.id;

const formatTime = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const enrichFinalShifts = (placements, publishedShifts) => {
    const shiftsById = new Map(
        publishedShifts
            .map((shift) => [getShiftId(shift), shift])
            .filter(([id]) => id !== undefined && id !== null)
    );

    return placements.map((placement) => {
        const shiftTemplate = shiftsById.get(placement.shiftId ?? placement.shift_id);

        return {
            ...shiftTemplate,
            ...placement,
            placementDate: placement.date,
            displayStart: formatTime(shiftTemplate?.startTime ?? placement.startTime),
            displayEnd: formatTime(shiftTemplate?.endTime ?? placement.endTime),
            displayDay: placement.day ?? shiftTemplate?.day ?? weekDays[shiftTemplate?.weekDay],
        };
    });
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

                const [finalShiftsResponse, publishedShiftsResponse] = await Promise.all([
                    getWorkShiftsForEmployee(),
                    getPublishedShifts(),
                ]);

                const payload = finalShiftsResponse?.data?.data ?? finalShiftsResponse?.data ?? {};
                const publishedPayload = publishedShiftsResponse?.data?.data ?? publishedShiftsResponse?.data ?? {};

                if (payload?.success === false) {
                    throw new Error(getServerErrorMessage(
                        payload,
                        "Could not load final shifts."
                    ));
                }

                if (isMounted) {
                    setShifts(enrichFinalShifts(
                        extractShifts(payload),
                        extractShifts(publishedPayload)
                    ));
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || err.response?.data?.message || "Could not load final shifts.");
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

            <header className="employee-view-header">
                <p className="employee-view-kicker">Employee View</p>
                <h1>Final Shifts</h1>
                <p>Your finalized work schedule will appear here.</p>
            </header>

            {error && <section className="employee-view-error">{error}</section>}

            {loading ? (
                <section className="employee-view-state">Loading final shifts...</section>
            ) : shifts.length === 0 ? (
                <section className="employee-view-empty">
                    <h2>No final shifts to display</h2>
                    <p>Once a final schedule is published, it will appear here.</p>
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
                                <td>{valueOf(shift, ["placementDate", "date", "shiftDate", "dayDate"])}</td>
                                <td>{valueOf(shift, ["displayDay", "day", "dayName"])}</td>
                                <td>{valueOf(shift, ["displayStart", "startHour", "startTime", "start"])}</td>
                                <td>{valueOf(shift, ["displayEnd", "endHour", "endTime", "end"])}</td>
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
