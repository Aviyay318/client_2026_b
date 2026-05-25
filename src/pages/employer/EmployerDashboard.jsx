import { useState, useEffect } from "react";
import RealTimeEmployee from "../../components/RealTimeEmployee.jsx";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import { getAllActiveEmployees } from "../../service/employerApi.js";
import "./EmployerDashboard.css";

function EmployerDashboard() {
    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        getAllActiveEmployees()
            .then((response) => {
                console.log("ACTIVE EMPLOYEES RESPONSE:", response.data);

                if (response.data !== null) {
                    setEmployeeList(response.data.employees || []);
                }
            })
            .catch((error) => {
                console.log("Error loading active employees", error.response?.data || error);
            });
    }, []);

    return (
        <div className="manager-dashboard-shell">
            <NavbarEmployer active="Dashboard" />

            <div className="manager-dashboard-content">
                <header className="manager-topbar">
                    <div>
                        <span className="manager-eyebrow">WorkSync Manager Panel</span>
                        <h1>Employer Dashboard</h1>
                        <p>Monitor active employees and live workplace activity.</p>
                    </div>
                </header>

                <section className="manager-stat-grid">
                    <div className="manager-stat-card">
                        <span className="manager-stat-label">Total Employees</span>
                        <strong>{employeeList.length}</strong>
                        <span className="manager-stat-note">Currently loaded</span>
                    </div>

                    <div className="manager-stat-card manager-stat-card-accent">
                        <span className="manager-stat-label">Active Now</span>
                        <strong>{employeeList.length}</strong>
                        <span className="manager-stat-note">Live presence</span>
                    </div>

                    <div className="manager-stat-card">
                        <span className="manager-stat-label">On Leave</span>
                        <strong>--</strong>
                        <span className="manager-stat-note">No source connected</span>
                    </div>

                    <div className="manager-stat-card">
                        <span className="manager-stat-label">Absent</span>
                        <strong>--</strong>
                        <span className="manager-stat-note">No source connected</span>
                    </div>
                </section>

                <RealTimeEmployee employees={employeeList} />
            </div>
        </div>
    );
}

export default EmployerDashboard;
