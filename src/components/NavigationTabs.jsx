import {useNavigate} from "react-router-dom";

function NavigationTabs({active}){



    const navigate = useNavigate();


    return (
        <div>

            <button
                className={active === "HoursReport" ? "active":""}
                onClick={()=>navigate("/work-hours-page")}>Hours Report</button>

            <button
                className={active === "Attendance" ? "active":""}
                onClick={() =>navigate("/employee-dashboard")}>Attendance</button>


        </div>


    )
}
export default NavigationTabs;