import {useEffect, useState} from "react";
import {enterWork, exitWork, getCurrentWorker, getSites} from "../../service/workApi.js";
import LocationButton from "../../components/LocationButton.jsx";
import WorkTimer from "../../components/WorkTimer.jsx";
import NavbarEmployee from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import "./EmployeeDashboard.css";
import AbsencePopUp from "../../components/AbsencePopUp.jsx";

function EmployeeDashboard() {

    const [sites, setSites] = useState([]);
    const [location, setLocation] = useState("office");
    const [selectedSite, setSelectedSite] = useState(null);
    const [isWorking, setIsWorking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [isAbsenceOpen , setAbsenceOpen] = useState(false);








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

            <NavbarEmployee active={"Attendance"} />

            <div className="attendance-page-header">
                <h1>
                    <span className="attendance-title-icon">⏱️</span>
                    Attendance
                </h1>

                <p>Track your work time and daily attendance</p>

                <div className="attendance-title-line"></div>
            </div>

            <div className="employee-dashboard-card">

                <section className="attendance-section">
                    <LocationButton
                        location={location}
                        setLocation={setLocation}
                        selectedSite={selectedSite}
                        setSelectedSite={setSelectedSite}
                        sites={sites}
                    />
                </section>

                <section className="attendance-section timer-section">
                    <WorkTimer
                        isWorking={isWorking}
                        startTime={startTime}
                    />
                </section>

                <section className="attendance-actions">
                    <button
                        className="enter-work-btn"
                        onClick={isWorking ? handleExit : handleEnter}
                    >
                        {isWorking ? "Exit Work" : "Enter Work"}
                    </button>
                </section>

                <section className="attendance-secondary-card">
                    <button
                        className="absence-btn"
                        onClick={() => setAbsenceOpen(true)}
                    >
                        Report Absence
                    </button>

                    <p className="absence-text">
                        Report if you are not able to work today
                    </p>
                </section>

                <AbsencePopUp
                    isAbsenceOpen={isAbsenceOpen}
                    setAbsenceOpen={setAbsenceOpen}
                />

            </div>
        </div>
    );
}

export default EmployeeDashboard;