import {useEffect, useState} from "react";
import {getAllEmployees} from "../../service/employerApi.js";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import EmployeeList from "../../components/EmployeeList.jsx";



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
        <div className="employee-list-page">

            <NavbarEmployer active={"EmployeeList"}/>

            <EmployeeList employees = {employees}/>

        </div>
    );
}
export  default EmployeeListPage;