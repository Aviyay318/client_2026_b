import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {enterWork, exitWork, getCurrentWorker} from "../../service/WorkApi.js";
import LocationButton from "../../components/LocationButton.jsx";
import NavigationTabs from "../../components/NavigationTabs.jsx";
import WorkTimer from "../../components/WorkTimer.jsx";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {

    const [location, setLocation] = useState("office");
    const [isWorking, setIsWorking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const token = Cookies.get("token");


    useEffect(() => {
        // לסנכרן עם רומן את המשתנים שהיהה אותם שמות כמו בצד שרת כלומר מה שחוזר מהשרת
        getCurrentWorker(token)
            .then(response => {
                console.log("STATUS RESPONSE:", response.data);
                if (response.data.success) {
                    setIsWorking(response.data.isWorking);
                    setStartTime(new Date(response.data.startTime));
                }
            }).catch(() => console.log("error"))

    }, [])

    const handleEnter = () => {
        console.log("clicked");
        console.log("TOKEN:", token);

        const now = Date.now();
        const data = {
            token: token,
            location: location,
            startTime: now,
        };
        enterWork(data)
            .then(response => {
                console.log("SERVER RESPONSE:", response.data)
                if (response.data.success) {
                    console.log(response.data.success);
                    setIsWorking(true);
                    setStartTime(now);
                }
            }).catch(error => {
            console.log("FULL ERROR:", error);
            console.log("RESPONSE:", error.response);
            console.log("DATA:", error?.response?.data);
        });
    }


    const handleExit = () => {
        const now =Date.now()
        const data = {
            token: token,
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

                <NavigationTabs active={"Attendance"}/>

                <LocationButton
                    location={location}
                    setLocation={setLocation}
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