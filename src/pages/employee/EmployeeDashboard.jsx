import {useEffect, useState} from "react";
import {enterWork, exitWork, getCurrentWorker, getSites} from "../../service/workApi.js";
import LocationButton from "../../components/LocationButton.jsx";
import EmployeeNavbar from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import WorkTimer from "../../components/WorkTimer.jsx";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {

    const [sites, setSites] = useState([]);
    const [location, setLocation] = useState("office");
    const [selectedSite, setSelectedSite] = useState(null);
    const [isWorking, setIsWorking] = useState(false);
    const [startTime, setStartTime] = useState(null);




    const currentWorker = () => {
        getCurrentWorker()
            .then(response => {
                if (response.data.success) {
                    setIsWorking(response.data.isWorking);
                    setStartTime(new Date(response.data.startTime));
                }
            }).catch(() => console.log("error"))

    }
    const listOfWebsites = () => {
        getSites()
        .then(response => {
            console.log("SITE",response.data);
            if (response.data.success) {
                setSites(response.data.workingSites );

            }
        })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        currentWorker()
        listOfWebsites()


    }, [])

    const handleEnter = () => {
        console.log("CLICK ");
        if (location === "site" &&  !selectedSite ) {

            return;
        }

        const now = Date.now();
        const data = {
            startTime: now,
            ...( location === "site" ?
                { siteId: selectedSite.id} :
                {location: location})
        };
        console.log(data)
        enterWork(data)
            .then(response => {
                console.log("ENTER",response.data);
                if (response.data.success) {
                    setIsWorking(true);
                    setStartTime(now);
                }
            }).catch(error => {
            console.log("FULL ERROR:", error);
            console.log("RESPONSE:", error.response);
        });
    }


    const handleExit = () => {
        console.log("CLICK EXIST");

        const now =Date.now()
        const data = {
            location: location,
            endTime: now,
        };
        exitWork(data)
            .then(response => {
                if (response.data.success) {
                    setIsWorking(false);
                    setStartTime(null);
                }
            }).catch(() => console.log("error"))
    }

    return (
        <div className="employee-dashboard-page">

            <div className="employee-dashboard-card">

                <EmployeeNavbar active={"Attendance"}/>

                <LocationButton
                    location={location}
                    setLocation={setLocation}
                    selectedSite={selectedSite}
                    setSelectedSite={setSelectedSite}
                    sites={sites}
                />

                <WorkTimer
                    isWorking={isWorking}
                    startTime={startTime}
                />

                <button
                    className="enter-work-btn"
                    onClick={isWorking ? handleExit : handleEnter}
                >
                    {isWorking ? "Exit Work" : "Enter Work"}
                </button>

                <button className="absence-btn">
                    Report Absence
                </button>

                <p className="absence-text">
                    Report if you are not able to work today
                </p>

            </div>
        </div>
    );
}

export default EmployeeDashboard;