import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton.jsx";

function NavbarEmployer({ active }) {
    return (
        <nav className="employerNavbar">
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
                    to="/employer-constraints"
                    className={`tab-btn ${
                        active === "EmployeeConstraints" ? "employer-active-tab" : ""
                    }`}
                >
                    Employee Constraints
                </Link>

            </div>

            <LogoutButton />

        </nav>
    );
}

export default NavbarEmployer;