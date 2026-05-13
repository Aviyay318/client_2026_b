import {Link, useNavigate} from "react-router-dom";
import "../NavbarEmployee.css";
import {logout} from "../../service/authApi.js";
import LogoutButton from "../../components/LogoutButton.jsx";

function NavbarEmployee({active}) {

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

            {/*להגיד לשיר להעביר בscc של   employeenavbar  */}
            {/*מה שקשור לעיצוב של logout להעביר לscc חדש ששיך  ל logout*/}

            {/*<LogoutButton/>*/}
            <button
                className="logout-btn"
                onClick={handleLogout}
            >


                Logout
            </button>

        </nav>
    );
}

export default NavbarEmployee;