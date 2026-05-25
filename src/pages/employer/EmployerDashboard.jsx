import { useState, useEffect } from "react";
import RealTimeEmployee from "../../components/RealTimeEmployee.jsx";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import { getAllActiveEmployees } from "../../service/employerApi.js";

function EmployerDashboard() {
    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        getAllActiveEmployees()
            .then((response) => {
                console.log("ACTIVE EMPLOYEES RESPONSE:", response.data);

                if (response.data !== null) {
                    setEmployeeList(response.data.employees || []);
                }
            })
            .catch((error) => {
                console.log("Error loading active employees", error.response?.data || error);
            });
    }, []);

    return (
        <div className="employer-dashboard">
            <NavbarEmployer active="Dashboard" />

            <div className="employer-dashboard-content">
                <h1>Employer Dashboard</h1>
                <RealTimeEmployee employees={employeeList} />
            </div>
        </div>
    );
}

export default EmployerDashboard;