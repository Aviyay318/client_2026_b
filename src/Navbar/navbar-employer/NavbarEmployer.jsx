import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton.jsx";

function NavbarEmployer({ active }) {
    return (
        <nav className="employerNavbar">
            <div className="manager-nav-brand">
                <span className="manager-nav-logo">WS</span>
                <div>
                    <strong>WorkSync</strong>
                    <span>Manager</span>
                </div>
            </div>

            <div className="nav-employer-tabs">
                <Link
                    to="/employer-dashboard"
                    className={`tab-btn ${
                        active === "Dashboard" ? "employer-active-tab" : ""
                    }`}
                >
                    Dashboard
                </Link>

                <Link
                    to="/employee-management-page"
                    className={`tab-btn ${
                        active === "AddRemoveEmployee" ? "employer-active-tab" : ""
                    }`}
                >
                    Add / Remove Employee
                </Link>

                <Link
                    to="/employee-list-page"
                    className={`tab-btn ${
                        active === "EmployeeList" ? "employer-active-tab" : ""
                    }`}
                >
                    Employee List
                </Link>

                <Link
                    to="/employer-requests"
                    className={`tab-btn ${
                        active === "Requests" ? "employer-active-tab" : ""
                    }`}
                >
                    Requests
                </Link>

                <Link
                    to="/employer-settings"
                    className={`tab-btn ${
                        active === "GeneralSettings" ? "employer-active-tab" : ""
                    }`}
                >
                    General Settings
                </Link>
            </div>

            <div className="manager-nav-footer">
                <LogoutButton />
            </div>
        </nav>
    );
}

export default NavbarEmployer;
