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
            </div>

            <div className="manager-nav-footer">
                <LogoutButton />
            </div>
        </nav>
    );
}

export default NavbarEmployer;
