import {useEffect, useState} from "react";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import ShiftSettingsTable from "../../components/ShiftSettingsTable.jsx";
import {
    getAllEmployees,
    getEmployerShifts
} from "../../service/employerApi.js";
import {formatTimeForInput} from "../../utils/timeUtils.js";
import {savePlacement} from "../../service/workApi.js";
import "./EmployerDashboard.css";
import "./EmployerPlacementBuilder.css";

const weekDays = [
    {value: 1, label: "Sunday"},
    {value: 2, label: "Monday"},
    {value: 3, label: "Tuesday"},
    {value: 4, label: "Wednesday"},
    {value: 5, label: "Thursday"},
    {value: 6, label: "Friday"},
    {value: 7, label: "Saturday"}
];

const getRequiredEmployees = (shift) => shift.employeeAmount || 0;

function EmployerPlacementBuilder() {
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [placements, setPlacements] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getEmployerShifts()
            .then((response) => {
                const shiftData = response.data?.success
                    ? response.data?.shifts || []
                    : [];

                setShifts(shiftData.map((shift) => ({
                    ...shift,
                    startTime: formatTimeForInput(shift.startTime),
                    endTime: formatTimeForInput(shift.endTime)
                })));

                const existingPlacements = {};
                let hasExistingData = false;

                shiftData.forEach((shift) => {
                    const shiftId = shift.id || shift.shift_id || shift.shiftId;
                    if (shift.placements || shift.assignedEmployees) {
                        hasExistingData = true;
                        const assigned = shift.placements || shift.assignedEmployees || [];
                        assigned.forEach((empId, index) => {
                            if (!existingPlacements[shiftId]) existingPlacements[shiftId] = {};
                            existingPlacements[shiftId][index] = empId;
                        });
                    }
                });

                if (hasExistingData) {
                    setPlacements(existingPlacements);
                    setIsEditMode(true);
                }
            })
            .catch((err) => {
                console.log("Error loading shifts", err);
                setError("Could not load shifts.");
            });

        getAllEmployees()
            .then((response) => {
                setEmployees(response.data?.employees || response.data || []);
            })
            .catch((err) => {
                console.log("Error loading employees", err);
                setError("Could not load employees.");
            });
    }, []);


    const isEmployeeAvailable = (employee, shift) => {
        if (!employee.constraints && !employee.constraintsList) return true;
        const constraints = employee.constraints || employee.constraintsList || [];
        const shiftDay = shift.weekDay || shift.day || shift.date;


        const hasConflict = constraints.some(constraint =>
            constraint.day === shiftDay || constraint.date === shiftDay
        );
        return !hasConflict;
    };

    const handleEmployeeChange = (shiftId, index, employeeId) => {
        setPlacements((current) => ({
            ...current,
            [shiftId]: {
                ...(current[shiftId] || {}),
                [index]: employeeId,
            },
        }));
    };

    const renderEmployeeSelectors = (shift, shiftIndex) => {
        const shiftId = shift.id || shift.shift_id || shift.shiftId || shiftIndex;
        const requiredEmployees = getRequiredEmployees(shift);

        return (
            <div className="placement-employee-grid">
                {Array.from({length: requiredEmployees}).map((_, index) => {
                    const currentSelection = placements[shiftId]?.[index] || "";

                    return (
                        <div key={index} className="placement-employee-select-wrap">
                            <select
                                value={currentSelection}
                                onChange={(e) => handleEmployeeChange(shiftId, index, e.target.value)}
                                className={!currentSelection ? "placement-select-required" : ""}
                            >
                                <option value="">Select employee</option>

                                {employees.map((employee) => {
                                    const employeeId = employee.id || employee.employeeId || employee.personalId;
                                    const employeeName =
                                        employee.fullName ||
                                        `${employee.firstName || ""} ${employee.lastName || ""}`.trim() ||
                                        employee.name ||
                                        "Employee";

                                    // תוספת: בדיקת זמינות העובד מול המשמרת הנוכחית
                                    const available = isEmployeeAvailable(employee, shift);

                                    return (
                                        <option key={employeeId} value={employeeId}>
                                            {employeeName} {available ? "🟢 (Available)" : "🔴 (Not Available)"}
                                        </option>
                                    );
                                })}
                            </select>
                            {/* תוספת: חיווי ויזואלי מהיר אם חסר שיבוץ בשורה הזו */}
                            {!currentSelection && <span style={{ color: 'orange', fontSize: '12px' }}>⚠️ Required</span>}
                        </div>
                    );
                })}
            </div>
        );
    };

    const handleSave = () => {
        setError("");
        setMessage("");

        const payload = [];
        let hasValidationErrors = false;
        for (const shift of shifts) {
            const shiftId = shift.id || shift.shift_id || shift.shiftId;
            const requiredEmployees = getRequiredEmployees(shift);
            for (let i = 0; i < requiredEmployees; i++) {
                const employeeId = placements[shiftId]?.[i];
                if (!employeeId) {
                    hasValidationErrors = true;
                    continue;
                }

                payload.push({
                    employee_id: employeeId,
                    shift_id: shiftId,
                    date: shift.date || shift.day || shift.weekDay,
                });
            }
        }
        if (hasValidationErrors) {
            setError("Validation Error: Please select employees for all required placements.");
            return;
        }
        savePlacement(payload)
            .then(() => {
                setMessage(isEditMode ? "Placement updated successfully." : "Placement saved successfully.");
                setIsEditMode(true);
            })
            .catch((err) => {
                console.log("Error saving placement", err);
                setError("Could not save placement.");
            });
    };

    return (
        <div className="manager-dashboard-shell employer-placement-page">
            <NavbarEmployer active="Placement" />

            <main className="employer-placement-content">
                <header className="employer-placement-hero">
                    <div className="employer-placement-hero-copy">
                        <span className="employer-placement-eyebrow">WorkSync Placement</span>
                        <h1>Employer Placement Builder</h1>
                        <p>Assign active employees to required work shifts.</p>
                    </div>

                    <button className="employer-placement-save-button" type="button" onClick={handleSave}>
                        {isEditMode ? "Update Placement" : "Save Placement"}
                    </button>
                </header>

                {error && <div className="employer-placement-message employer-placement-error">{error}</div>}
                {message && <div className="employer-placement-message employer-placement-success">{message}</div>}

                <section className="employer-placement-table-card">
                    <ShiftSettingsTable
                        mode="placement"
                        shifts={shifts}
                        weekDays={weekDays}
                        renderEmployees={renderEmployeeSelectors}
                        emptyMessage="No shifts to display."
                        getShiftId={(shift, shiftIndex) =>
                            shift.id || shift.shift_id || shift.shiftId || shiftIndex
                        }
                    />

                    <section className="employer-placement-info-card">
                        <span className="employer-placement-info-icon" aria-hidden="true">i</span>
                        <div>
                            <h2>About Placement</h2>
                            <p>
                                Assign the required number of employees for each day and time period.
                                These assignments will be applied to the schedule.
                            </p>
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}

export default EmployerPlacementBuilder;
