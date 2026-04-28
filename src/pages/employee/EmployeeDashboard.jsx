import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {enterWork, exitWork, getCurrentWorker} from "../../service/WorkApi.js";
import LocationButton from "../../components/LocationButton.jsx";
import NavigationTabs from "../../components/NavigationTabs.jsx";
import WorkTimer from "../../components/WorkTimer.jsx";

function EmployeeDashboard() {

    const [location, setLocation] = useState("office");
    const [isWorking, setIsWorking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const token = Cookies.get("token");


    useEffect(() => {
        // לסנכרן עם רומן את המשתנים שהיהה אותם שמות כמו בצד שרת כלומר מה שחוזר מהשרת
        getCurrentWorker(token)
            .then(response => {
                if (response.data.success){
                    setIsWorking(response.data.isWorking)
                    setStartTime(response.data.startTime);
                }
            }).catch(()=>console.log("error"))

    },[])

    const handleEnter =()=>{
       const now = new Date();
       console.log("CLICK ENTER")
        const data = {
            token: token,
            location: location,
            startTime: now,
        };
        enterWork(data)
            .then(response => {
                if (response.data.success){
                    setIsWorking(true);
                    setStartTime(now);
                }
            }).catch(()=>console.log("error"))
    }


    const handleExit =()=>{
        const now = new Date();
        const data = {
            token: token,
            location: location,
            endTime: now,
        };
        exitWork(data)
            .then(response => {
                if (response.data.success){
                    setIsWorking(false);
                    setStartTime(null);
                }
            }).catch(()=>console.log("error"))
    }

   return (
       <>
          <NavigationTabs active={"dashboard"}/>
           <LocationButton location={location} setLocation={setLocation}/>
           <WorkTimer isWorking={isWorking} startTime={startTime}/>
           <button onClick={isWorking ? handleExit:handleEnter}>
               {isWorking?"Exit":"Enter"}
           </button>
           <button> Report Absence </button>


       </>
   )
}
export default EmployeeDashboard;