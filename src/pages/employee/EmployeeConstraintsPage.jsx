import {useEffect, useState} from "react";
import NavbarEmployee from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import {
    getEmployerSettings,
    getPublishedShifts,
    saveEmployeeConstraints,
} from "../../service/employeeConstraintsApi.js";
import "./EmployeeViewPages.css";

const getResponsePayload = (response) => response?.data?.data ?? response?.data ?? {};

const extractList = (payload, keys) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    for (const key of keys) {
        if (Array.isArray(payload?.[key])) {
            return payload[key];
        }
    }

    return [];
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

const getShiftId = (shift) => shift.shift_id ?? shift.shiftId ?? shift.id ?? shift._id;

const formatDate = (value) => {
    if (!value) {
        return "Not set";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("he-IL", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const isPastDeadline = (value) => {
    if (!value) {
        return false;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    return Date.now() > date.getTime();
};

const getShiftDate = (shift) => shift.date ?? shift.shiftDate ?? shift.dayDate ?? "";

const getConstraintDate = (shift) => getShiftDate(shift) || shift.startTime || "";

const formatTime = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatShiftTitle = (shift) => {
    const date = getShiftDate(shift);
    const start = shift.startHour || formatTime(shift.startTime) || shift.startTime || shift.start || "";
    const end = shift.endHour || formatTime(shift.endTime) || shift.endTime || shift.end || "";
    const day = shift.day ?? weekDays[shift.weekDay] ?? "";

    return [date || day, start && end ? `${start} - ${end}` : start || end]
        .filter(Boolean)
        .join(" | ");
};

function EmployeeConstraintsPage() {
    const [deadline, setDeadline] = useState(null);
    const [shifts, setShifts] = useState([]);
    const [constraints, setConstraints] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [deadlinePassed, setDeadlinePassed] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadPageData = async () => {
            try {
                setLoading(true);
                setError("");

                const [settingsResponse, shiftsResponse] = await Promise.all([
                    getEmployerSettings(),
                    getPublishedShifts(),
                ]);

                if (!isMounted) {
                    return;
                }

                const settingsPayload = getResponsePayload(settingsResponse);
                const shiftsPayload = getResponsePayload(shiftsResponse);
                const nextShifts = extractList(shiftsPayload, [
                    "shifts",
                    "publishedShifts",
                    "availableShifts",
                    "employerShifts",
                    "settingsShifts",
                ]).filter((shift) => shift.posted !== false && shift.active !== false);

                const nextDeadline = settingsPayload.submitionExparation ?? null;

                setDeadline(nextDeadline);
                setDeadlinePassed(isPastDeadline(nextDeadline));
                setShifts(nextShifts);
                setConstraints(
                    nextShifts.reduce((acc, shift) => {
                        const id = getShiftId(shift);

                        if (id !== undefined && id !== null) {
                            acc[id] = {
                                available: true,
                                comment: "",
                            };
                        }

                        return acc;
                    }, {})
                );
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || "Could not load constraints data.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadPageData();

        return () => {
            isMounted = false;
        };
    }, []);

    const updateConstraint = (shiftId, field, value) => {
        setSuccessMessage("");
        setConstraints((current) => ({
            ...current,
            [shiftId]: {
                available: current[shiftId]?.available ?? true,
                comment: current[shiftId]?.comment ?? "",
                [field]: value,
            },
        }));
    };

    const handleSave = async () => {
        if (deadlinePassed || saving) {
            return;
        }

        const payload = shifts
            .map((shift) => {
                const shiftId = getShiftId(shift);

                return {
                    shift_id: shiftId,
                    available: constraints[shiftId]?.available ?? true,
                    comment: constraints[shiftId]?.comment ?? "",
                    date: getConstraintDate(shift),
                };
            })
            .filter((item) => item.shift_id !== undefined && item.shift_id !== null);

        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            await saveEmployeeConstraints(payload);

            setSuccessMessage("האילוצים נשמרו בהצלחה");
        } catch (err) {
            setError(err.response?.data?.message || "Could not save constraints.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="employee-view-page">
            <NavbarEmployee active="Constraints" />

            <header className="employee-view-header" dir="rtl">
                <p className="employee-view-kicker">Employee View</p>
                <h1>הגשת אילוצים</h1>
                <div className="employee-view-deadline">
                    <span>מועד אחרון להגשת אילוצים</span>
                    <strong>{formatDate(deadline)}</strong>
                </div>
            </header>

            {deadlinePassed && (
                <section className="employee-view-alert" dir="rtl">
                    מועד ההגשה עבר. ניתן לצפות באילוצים, אך לא לערוך או לשלוח אותם.
                </section>
            )}

            {error && <section className="employee-view-error">{error}</section>}
            {successMessage && <section className="employee-view-success">{successMessage}</section>}

            {loading ? (
                <section className="employee-view-state">Loading available shifts...</section>
            ) : shifts.length === 0 ? (
                <section className="employee-view-empty" dir="rtl">
                    <h2>אין משמרות זמינות להגשת אילוצים</h2>
                    <p>כאשר המעסיק יפרסם משמרות, הן יופיעו כאן בצורה מסודרת.</p>
                </section>
            ) : (
                <>
                    <section className="constraints-list">
                        {shifts.map((shift, index) => {
                            const shiftId = getShiftId(shift) ?? index;
                            const currentConstraint = constraints[shiftId] ?? {
                                available: true,
                                comment: "",
                            };

                            return (
                                <article className="constraint-card" key={shiftId}>
                                    <div className="constraint-shift-info">
                                        <span className="constraint-label">Shift</span>
                                        <h2>{formatShiftTitle(shift) || `Shift ${index + 1}`}</h2>
                                        <p>
                                            {[
                                                shift.location,
                                                shift.role,
                                                shift.day ?? weekDays[shift.weekDay],
                                                shift.employeeAmount ? `${shift.employeeAmount} employees` : "",
                                            ].filter(Boolean).join(" / ")}
                                        </p>
                                    </div>

                                    <div className="constraint-controls">
                                        <label className="availability-toggle">
                                            <input
                                                type="checkbox"
                                                checked={currentConstraint.available}
                                                disabled={deadlinePassed}
                                                onChange={(event) =>
                                                    updateConstraint(shiftId, "available", event.target.checked)
                                                }
                                            />
                                            <span>{currentConstraint.available ? "Available" : "Unavailable"}</span>
                                        </label>

                                        <label className="constraint-comment">
                                            <span>Comment</span>
                                            <input
                                                type="text"
                                                value={currentConstraint.comment}
                                                disabled={deadlinePassed}
                                                placeholder="Reason or note"
                                                onChange={(event) =>
                                                    updateConstraint(shiftId, "comment", event.target.value)
                                                }
                                            />
                                        </label>
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    <div className="employee-view-actions">
                        <button
                            className="employee-primary-action"
                            type="button"
                            disabled={deadlinePassed || saving}
                            onClick={handleSave}
                        >
                            {saving ? "Saving..." : "Save Constraints"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default EmployeeConstraintsPage;
