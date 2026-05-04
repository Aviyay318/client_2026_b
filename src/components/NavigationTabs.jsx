import {useNavigate} from "react-router-dom";
import "./NavigationTabs.css";

function NavigationTabs({active}) {

    const navigate = useNavigate();

    return (
        <div className="tabs-container">
            <div className="tabs-box">

                <button
                    className={`tab-btn ${active === "HoursReport" ? "active-tab" : ""}`}
                    onClick={() => navigate("/work-hours-page")}
                >
                    Hours Report
                </button>

                <button
                    className={`tab-btn ${active === "Attendance" ? "active-tab" : ""}`}
                    onClick={() => navigate("/employee-dashboard")}
                >
                    Attendance
                </button>

            </div>
        </div>
    );
}

export default NavigationTabs;