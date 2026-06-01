import { useState, useEffect } from "react";
import RealTimeEmployee from "../../components/RealTimeEmployee.jsx";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import "./EmployerDashboard.css";
import DashboardCard from "../../components/DashboardCard.jsx";
import {
    getAbsentEmployees,
    getAllActiveEmployees,
    getAllEmployees,
    getLeftEmployees
} from "../../service/employerApi.js";
import {refreshToken} from "../../service/authApi.js";
import RefreshButton from "../../components/RefreshButton.jsx";


function EmployerDashboard() {
    const [activeEmployees, setActiveEmployees] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState([]);
    const [leftEmployees, setLeftEmployees] = useState([]);
    const [absentEmployees,setAbsentEmployees] = useState([]);


    const data = {
        date: Date.now()
    };

    const AllActiveEmployees = () => {
        getAllActiveEmployees()
            .then((response) => {
                console.log("ACTIVE EMPLOYEES RESPONSE:", response.data);
                if (response.data !== null) {
                    setActiveEmployees(response.data.employees || []);
                }
            })
            .catch((error) => {
                console.log("Error loading active employees", error.response?.data || error);
            });
    }

   const TotalEmployees = () =>{
       getAllEmployees ()
   .then((response) => {
           console.log("TOTAL EMPLOYYES RESPONSE:" , response.data);
           if(response.data !== null){
               setTotalEmployees(response.data.employees || [])
           }
       })
           .catch((error) => {
               console.log("Error loading total employees", error.response?.data || error);
           });
   }

    const LeftEmployees = () => {
        getLeftEmployees (data)
    .then((response) => {
            console.log("LEFT EMPLOYYES RESPONSE:" , response.data);
            if(response.data !== null){
                setLeftEmployees(response.data.employees || [])
            }
        })
            .catch((error) => {
                console.log("Error loading left employees", error.response?.data || error);
            });
    }

    const AbsentEmployees = () => {
        getAbsentEmployees (data)
           .then((response) =>{
               console.log("ABSENT EMPLOYEES RESPONSE:" , response.data);
               if(response.data !== null) {
                   setAbsentEmployees(response.data.employees || [])
               }
               })
           .catch((error) => {
               console.log("Error loading absent employees", error.response?.data || error);
           });
    }
    const Refreshing =()=>{
        refreshToken ()
            .then(response =>{
                if (response.data !== null){
                    setActiveEmployees(response.data.employees || [])
                }
            })
    }



    useEffect(() => {
     AllActiveEmployees();
        Refreshing();
        AbsentEmployees();
        LeftEmployees();
        TotalEmployees();
    }, []);




    return (
        <div className="manager-dashboard-shell">
            <NavbarEmployer active="Dashboard" />

            <div className="manager-dashboard-content">
                <header className="manager-topbar">
                    <div>
                        <span className="manager-eyebrow">WorkSync Manager Panel</span>
                        <h1>Employer Dashboard</h1>
                        <p>Monitor active employees and live workplace activity.</p>
                    </div>
                </header>

                <DashboardCard title={"Total"} count={totalEmployees.length}/>
                <DashboardCard title={"Active Employee"} count={activeEmployees.length}/>


                <DashboardCard
                    title={"Absent Employees"}
                    count={absentEmployees.length}
                    employees={absentEmployees}
                />


                <DashboardCard
                    title={"Left Employees"}
                    count={leftEmployees.length}
                    employees={leftEmployees}
                />
                <RefreshButton onRefresh={AllActiveEmployees}/>
                <RealTimeEmployee employees={activeEmployees} />
            </div>
        </div>
    );
}

export default EmployerDashboard;
