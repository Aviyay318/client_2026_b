import {useEffect, useState} from "react";
import CustomDatePicker from "./CustomDatePicker.jsx";
import {getAllAbsenceReasons, reportAbsence} from "../service/workApi.js";
import "./AbsencePopUp.css";



function AbsencePopUp({isAbsenceOpen,setAbsenceOpen}) {

    const [absenceResponse, setAbsenceResponse] = useState([]);
    const [selectedResponse, setSelectedResponse] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);



    useEffect(() => {
        getAllAbsenceReasons().
        then(response => {
            console.log("Absence",response.data);
            if (response.data !== null) {
                setAbsenceResponse(response.data.absenceReasons);

            }

        })
            .catch(error => console.log(error));



    },[])

    const handleAbsence = () => {
        const data = {
            selectedDate,selectedResponse};

        reportAbsence(data).
        then(response => {
            // לבדוק עם רומן מה הצד שרת מחזיר  )
            if (response.data){
                setAbsenceOpen(false)
                setSelectedDate(null)
                setSelectedResponse("")
            }
        })
        .catch(error => console.log(error));
    }


    const  validation =() => {
        let  isValid = false ;
        if(!selectedResponse||!selectedDate ){
            isValid = true ;
        }
        return isValid ;
        }
        if (!isAbsenceOpen){
           return null
       }



    return (
        <div className="absence-popup-card">

            <button
                type="button"
                className="absence-close-btn"
                onClick={() => setAbsenceOpen(false)}
            >
                ×
            </button>

            <div className="absence-popup-header">

                <h2 className="absence-popup-title">
                    Report Absence
                </h2>

            </div>

            <div className="absence-popup-content">

                <div className="absence-field">

                    <label className="absence-label">
                        Select date
                    </label>

                    <div className="absence-date-box">
                        <CustomDatePicker
                            mode="single"
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    </div>

                </div>

                <div className="absence-field">

                    <label className="absence-label">
                        Select reason
                    </label>

                    <div className="absence-select-wrapper">

                        <select
                            className="absence-select"
                            value={selectedResponse}
                            onChange={(event) =>
                                setSelectedResponse(event.target.value)
                            }
                        >
                            <option value="">
                                Select absence reason
                            </option>

                            {
                                absenceResponse.map(response => (

                                    <option
                                        key={response.id}
                                        value={response.id}
                                    >
                                        {
                                            response.name
                                                ? response.name
                                                : response.reason
                                                    ? response.reason
                                                    : response.title
                                                        ? response.title
                                                        : response
                                        }
                                    </option>
                                ))
                            }

                        </select>

                    </div>

                </div>

            </div>

            <button
                type="button"
                className={`send-absence-btn ${
                    validation()
                        ? "disabled-send-btn"
                        : ""
                }`}
                onClick={handleAbsence}
                disabled={validation()}
            >
                Send Report
            </button>

            {
                validation() && (

                    <p className="absence-help-text">
                        Please select a date and reason to continue.
                    </p>
                )
            }

        </div>
    );
    }
export default AbsencePopUp;