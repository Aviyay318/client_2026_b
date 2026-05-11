import {Link, useNavigate} from "react-router-dom";
import "./EmployeeNavbar.css";
import {logout} from "../service/authApi.js";

function EmployeeNavbar({active}) {
    const navigate = useNavigate();
    const handleLogout =()=>{
        logout()
            .then(response =>{
                if (response.data.success){
                    console.log("LOGOUT",response.data);
                  navigate("/");
                }
            })
            .catch(error => console.log(error));

    }



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

            </div>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >


                Logout
            </button>

        </nav>
    );
}

export default EmployeeNavbar;