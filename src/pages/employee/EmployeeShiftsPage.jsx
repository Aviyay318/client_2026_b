import {useState, useEffect} from "react";
import dayjs from "dayjs";
import NavbarEmployee from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import {getAllShifts} from "../../service/shiftsApi.js";
import ShiftsTable from "../../components/ShiftsTable.jsx";
import CustomDatePicker from "../../components/CustomDatePicker.jsx";

function EmployeeShiftsPage() {

    const [fromDate, setFromeDate] = useState("");
    const [toDate, setToDoDate] = useState("");
    const [shifts, setShifts] = useState([{
    }]);


    useEffect(() => {
        if (!fromDate || !toDate) {
            return;
        }

        const data = {
            fromDate: dayjs(fromDate).format("DD-MM-YYYY"),
            toDate: dayjs(toDate).format("DD-MM-YYYY"),
        };

        console.log("DATES SENT TO SERVER:", data);
        getAllShifts(data)
            .then(response => {
                console.log("SHIFTS", response.data);

                if (response.data !== null) {
                    setShifts(response.data.shifts);
                }
            })
            .catch(err => {
                console.log("SHIFTS ERROR STATUS:", err.response?.status);
                console.log("SHIFTS ERROR DATA:", err.response?.data);
            });

    }, [fromDate, toDate]);

    return(
        <div>
            <NavbarEmployee active="Shifts" />

            <div className="shifts-page-header">
                <h1>
                    <span className="shifts-title-icon">🗓️</span>
                    My Shifts
                </h1>

                <p>View your scheduled work shifts by date range.</p>

                <div className="shifts-title-line"></div>
            </div>

            <div className="shifts-date-range-box">

                <div className="date-range-title">
                    <span className="date-range-main-icon">📅</span>
                    <span>Select date range</span>
                </div>

                <div className="date-input-card">
                    <label>From date</label>

                    <CustomDatePicker
                        mode="single"
                        selectedDate={fromDate}
                        setSelectedDate={setFromeDate}
                    />
                </div>

                <span className="date-arrow">→</span>

                <div className="date-input-card">
                    <label>To date</label>

                    <CustomDatePicker
                        mode="single"
                        selectedDate={toDate}
                        setSelectedDate={setToDoDate}
                    />
                </div>

            </div>

            <ShiftsTable shifts={shifts} />
        </div>
    );
}
export default EmployeeShiftsPage;