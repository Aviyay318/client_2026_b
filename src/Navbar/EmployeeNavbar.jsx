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
        <nav>

            <div className="tabs-container">

                <div className="tabs-box">

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

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default EmployeeNavbar;