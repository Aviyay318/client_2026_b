import {useState, useEffect} from "react";
import dayjs from "dayjs";
import NavbarEmployee from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import {getAllShifts} from "../../service/shiftsApi.js";
import ShiftsTable from "../../components/ShiftsTable.jsx";
import CustomDatePicker from "../../components/CustomDatePicker.jsx";

function EmployeeShiftsPage() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [shifts, setShifts] = useState([{
        day: "Sunday",

        date: "19/05/2026",

        startHour: "08:00",

        endHour: "16:00",

        location: "Office",

        role: "Cashier"
    }]);


    useEffect(() => {
        if (!startDate || !endDate) {
            return;
        }

        const data = {
            fromDate: dayjs(startDate).format("DD-MM-YYYY"),
            toDate: dayjs(endDate).format("DD-MM-YYYY"),
        };

        console.log("DATES SENT TO SERVER:", data);
        getAllShifts(data)
            .then(response => {
                console.log("SHIFTS", response.data);

                if (response.data !== null) {
                    setShifts(response.data);
                }
            })
            .catch(err => {
                console.log("SHIFTS ERROR STATUS:", err.response?.status);
                console.log("SHIFTS ERROR DATA:", err.response?.data);
            });

    }, [startDate, endDate]);

    return(
        <div>

            <NavbarEmployee active="Shifts" />


            <CustomDatePicker
            mode="range"
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            />

            <ShiftsTable shifts={shifts} />
        </div>
    );
}
export default EmployeeShiftsPage;
