import {useEffect, useState} from "react";
import ConstraintsTable from "../../components/ConstraintsTable.jsx";
import {getEmployeeConstraints} from "../../service/employerApi.js";
import CustomDatePicker from "../../components/CustomDatePicker.jsx";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";

function EmployerConstraintsView() {

    const [constraints, setConstraints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedAvailability, setSelectedAvailability] = useState("");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getEmployeeConstraints()
            .then((response) => {
                setConstraints(response.data);
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredConstraints = constraints.filter((constraint) => {

        const constraintDate = new Date(constraint.date);

        const matchEmployee =
            selectedEmployee === "" ||
            constraint.employeeName === selectedEmployee;

        const matchAvailability =
            selectedAvailability === "" ||
            String(constraint.available) === selectedAvailability;

        const matchDate =
            (!startDate || constraintDate >= startDate) &&
            (!endDate || constraintDate <= endDate);

        return matchEmployee && matchAvailability && matchDate;

    });


    if (loading) {
        return <h2>Loading...</h2>
    }
    if (error) {
        return <h2>Error loading constraints</h2>
    }


    return (
        <div>

            <NavbarEmployer active="EmployeeConstraints" />

        <div className="filters">

            <CustomDatePicker
                mode="range"
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />

            <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
            >
                <option value="">All Employees</option>

                {[...new Set(constraints.map(
                    (constraint) => constraint.employeeName
                ))].map((employeeName) => (
                    <option key={employeeName} value={employeeName}>
                        {employeeName}
                    </option>
                ))}
            </select>

            <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
            >
                <option value="">All Availability</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
            </select>

        </div>

        <ConstraintsTable constraints={filteredConstraints}/>


        </div>

)
}

export default EmployerConstraintsView;