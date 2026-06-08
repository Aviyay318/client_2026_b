import {useEffect, useState} from "react";
import {getAllEmployees} from "../../service/employerApi.js";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import EmployeeList from "../../components/EmployeeList.jsx";
import "./EmployerDashboard.css";



function EmployeeListPage () {
    const [employees,setEmployees]=useState([]);

    useEffect(() => {
        getAllEmployees()
            .then((response)=>{
                if (response.data !== null){
                    setEmployees(response.data.employees || []);
                }
            })
            .catch((error)=>{
                console.log("Error loading employees", error);
            });
    }, []);


    return(
        <div className="manager-dashboard-shell employee-list-page">

            <NavbarEmployer active={"EmployeeList"}/>

            <div className="manager-dashboard-content">
                <header className="manager-topbar">
                    <div>
                        <span className="manager-eyebrow">WorkSync Directory</span>
                        <h1>Employee List</h1>
                        <p>Review employees and open individual work-hour details.</p>
                    </div>
                </header>

                <EmployeeList employees = {employees}/>
            </div>

        </div>
    );
}
export  default EmployeeListPage;
