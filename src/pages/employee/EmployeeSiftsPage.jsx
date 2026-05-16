import {useState, useEffect} from "react";
import NavbarEmployee from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import {getAllShifts} from "../../service/shiftsApi.js";
import SiftsTable from "../../components/SiftsTable.jsx";
import CustomDatePicker from "../../components/CustomDatePicker.jsx";

function EmployeeShiftsPage() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        const data = {
            startDate: startDate,
            endDate: endDate,
        }
        getAllShifts(data).then(response => {
            if (response.data !== null) {
                setShifts(response.data);
            }
        })

    }, [startDate, endDate]);

    return(
        <div>

            <h1>Employee Shifts Page</h1>


            <CustomDatePicker
            mode="range"
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            />

            <SiftsTable shifts={shifts} />
        </div>
    );
}
export default EmployeeShiftsPage;
