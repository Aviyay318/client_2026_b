import {Link} from "react-router-dom";
import "../NavbarEmployee.css";
import LogoutButton from "../../components/LogoutButton.jsx";
function NavbarEmployee({active}) {

    return (
        <nav className="employee-navbar">

            <div className="nav-tabs-group">

                <Link
                    to="/employee-dashboard"
                    className={`tab-btn ${
                        active === "Attendance"
                            ? "active-tab"
                            : ""
                    }`}
                >
                    Attendance
                </Link>

                <Link
                    to="/work-hours-page"
                    className={`tab-btn ${
                        active === "HoursReport"
                            ? "active-tab"
                            : ""
                    }`}
                >
                    Hours Report
                </Link>

                <Link
                    to="/employee-shifts-page"
                    className={`tab-btn ${
                        active === "Shifts"
                        ?"active-tab"
                            :""
                    }`}
                    >
                    Shifts
                </Link>

                <Link
                    to="/employee-constraints"
                    className={`tab-btn ${
                        active === "Constraints"
                            ? "active-tab"
                            : ""
                    }`}
                >
                    Constraints
                </Link>

                <Link
                    to="/employee-final-shifts"
                    className={`tab-btn ${
                        active === "FinalShifts"
                            ? "active-tab"
                            : ""
                    }`}
                >
                    Final Shifts
                </Link>

                <Link
                    to="/employee-notifications"
                    className={`tab-btn ${
                        active === "Notifications"
                            ? "active-tab"
                            : ""
                    }`}
                >
                    Notifications
                </Link>

            </div>


            <LogoutButton/>

        </nav>
    );
}

export default NavbarEmployee;
