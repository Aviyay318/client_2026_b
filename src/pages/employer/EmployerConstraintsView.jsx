import {useEffect, useState} from "react";
import ConstraintsTable from "../../components/ConstraintsTable.jsx";
import {getEmployeeConstraints} from "../../service/employerApi.js";
import CustomDatePicker from "../../components/CustomDatePicker.jsx";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import "./EmployerDashboard.css";

const getResponsePayload = (response) => response?.data?.data ?? response?.data?.result ?? response?.data ?? {};

const extractConstraints = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.constraints)) {
        return payload.constraints;
    }

    if (Array.isArray(payload?.employeeConstraints)) {
        return payload.employeeConstraints;
    }

    if (Array.isArray(payload?.items)) {
        return payload.items;
    }

    return [];
};

function EmployerConstraintsView() {

    const [constraints, setConstraints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedAvailability, setSelectedAvailability] = useState("");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getEmployeeConstraints()
            .then((response) => {
                setConstraints(extractConstraints(getResponsePayload(response)));
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredConstraints = constraints.filter((constraint) => {

        const constraintDate = new Date(constraint.date);

        const matchEmployee =
            selectedEmployee === "" ||
            constraint.employeeName === selectedEmployee;

        const matchAvailability =
            selectedAvailability === "" ||
            String(constraint.available) === selectedAvailability;

        const matchDate =
            (!startDate || constraintDate >= startDate) &&
            (!endDate || constraintDate <= endDate);

        return matchEmployee && matchAvailability && matchDate;

    });


    if (loading) {
        return (
            <div className="manager-dashboard-shell">
                <NavbarEmployer active="EmployeeConstraints" />
                <main className="manager-dashboard-content">
                    <section className="manager-state">Loading constraints...</section>
                </main>
            </div>
        );
    }
    if (error) {
        return (
            <div className="manager-dashboard-shell">
                <NavbarEmployer active="EmployeeConstraints" />
                <main className="manager-dashboard-content">
                    <section className="manager-error">Error loading constraints</section>
                </main>
            </div>
        );
    }


    return (
        <div className="manager-dashboard-shell">

            <NavbarEmployer active="EmployeeConstraints" />

            <main className="manager-dashboard-content">
                <header className="manager-topbar">
                    <div>
                        <span className="manager-eyebrow">WorkSync Manager Panel</span>
                        <h1>Employee Constraints</h1>
                        <p>Review employee availability before building the final schedule.</p>
                    </div>
                </header>

        <div className="filters manager-glass-panel">

            <CustomDatePicker
                mode="range"
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />

            <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
            >
                <option value="">All Employees</option>

                {[...new Set(constraints.map(
                    (constraint) => constraint.employeeName
                ))].map((employeeName) => (
                    <option key={employeeName} value={employeeName}>
                        {employeeName}
                    </option>
                ))}
            </select>

            <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
            >
                <option value="">All Availability</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
            </select>

        </div>

                {filteredConstraints.length === 0 ? (
                    <section className="manager-state">No constraints found</section>
                ) : (
                    <ConstraintsTable constraints={filteredConstraints}/>
                )}

            </main>

        </div>

)
}

export default EmployerConstraintsView;
