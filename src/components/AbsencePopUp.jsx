import { useEffect, useState } from "react";
import CustomDatePicker from "./CustomDatePicker.jsx";
import { getAllAbsenceReasons, reportAbsence } from "../service/workApi.js";
import "./AbsencePopUp.css";

function AbsencePopUp({ isAbsenceOpen, setAbsenceOpen }) {

    const [absenceResponse, setAbsenceResponse] = useState([]);
    const [selectedResponse, setSelectedResponse] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [isReasonOpen, setIsReasonOpen] = useState(false);

    useEffect(() => {
        getAllAbsenceReasons()
            .then(response => {
                console.log("Absence", response.data);

                if (response.data !== null) {
                    setAbsenceResponse(response.data.absenceReasons || []);
                }
            })
            .catch(error => console.log(error));
    }, []);

    const getReasonText = (reason) => {
        if (typeof reason === "string") {
            return reason;
        }

        if (reason.name) {
            return reason.name;
        }

        if (reason.reason) {
            return reason.reason;
        }

        if (reason.title) {
            return reason.title;
        }

        return "";
    };

    const getReasonValue = (reason) => {
        if (reason.id !== undefined && reason.id !== null) {
            return String(reason.id);
        }

        return getReasonText(reason);
    };

    const getSelectedReasonText = () => {
        const selectedReason = absenceResponse.find(reason =>
            getReasonValue(reason) === selectedResponse
        );

        if (selectedReason) {
            return getReasonText(selectedReason);
        }

        return "Choose a reason";
    };
    const handleAbsence = () => {
        const data = {
            // לבדוק עם אביה מחר
            // selectedDate,
           reason: selectedResponse
        };

        console.log("REPORT ABSENCE DATA:", data);

        reportAbsence(data)
            .then(response => {
                console.log("REPORT ABSENCE RESPONSE:", response.data);

                if (response.data) {
                    setAbsenceOpen(false);
                }
            })
            .catch(error => {
                console.log("REPORT ABSENCE ERROR:", error);
                console.log("REPORT ABSENCE ERROR RESPONSE:", error.response?.data);
            });
    };

    const validation = () => {
        const noReason =
            selectedResponse === "" ||
            selectedResponse === null ||
            selectedResponse === undefined;

        const noDate =
            selectedDate === "" ||
            selectedDate === null ||
            selectedDate === undefined;

        return noReason || noDate;
    };

    if (!isAbsenceOpen) {
        return null;
    }

    return (
        <div className="absence-popup-card">

            <button
                type="button"
                className="absence-close-btn"
                onClick={() => {
                    setIsReasonOpen(false);
                    setAbsenceOpen(false);
                }}
            >
                ×
            </button>

            <div className="absence-popup-header">

                <h2 className="absence-popup-title">
                    Report Absence
                </h2>

                <p className="absence-popup-subtitle">
                    Report if you are not able to work today.
                </p>

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

                    <div className="absence-reason-box">

                        <button
                            type="button"
                            className={`reason-box-title ${
                                isReasonOpen ? "reason-box-open" : ""
                            }`}
                            onClick={() => setIsReasonOpen(!isReasonOpen)}
                        >
                            <span>
                                {getSelectedReasonText()}
                            </span>

                            <span className="reason-box-arrow">
                                ⌄
                            </span>
                        </button>

                        {
                            isReasonOpen && (

                                <div className="reason-list">

                                    {
                                        absenceResponse.map((reason, index) => {

                                            const reasonText = getReasonText(reason);
                                            const reasonValue = getReasonValue(reason);

                                            return (

                                                <button
                                                    key={reasonValue || index}
                                                    type="button"
                                                    className={`reason-row ${
                                                        selectedResponse === reasonValue
                                                            ? "active-reason-row"
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedResponse(reasonValue);
                                                        setIsReasonOpen(false);
                                                    }}
                                                >
                                                    <span className="reason-icon">
                                                            ✦
                                                    </span>

                                                    <span className="reason-text">
                                                        {reasonText}
                                                    </span>

                                                </button>
                                            );
                                        })
                                    }

                                </div>
                            )
                        }

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