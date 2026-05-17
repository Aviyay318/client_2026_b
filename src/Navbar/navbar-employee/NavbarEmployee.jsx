import {Link, useNavigate} from "react-router-dom";
import "../NavbarEmployee.css";
import {logout} from "../../service/authApi.js";
import LogoutButton from "../../components/LogoutButton.jsx";

function NavbarEmployee({active}) {

    const navigate = useNavigate();




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
                    classname={`tab-btn ${
                        active === "Shifts"
                        ?"active-tab"
                            :""
                    }`}
                    >
                    Shifts
                </Link>

            </div>


            <LogoutButton/>

        </nav>
    );
}

export default NavbarEmployee;