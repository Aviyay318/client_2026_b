import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CustomDatePicker({ mode, selectedDate, setSelectedDate}) {

    if (mode === "single") {
        return (
            <DatePicker
                selected={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                dateFormat="dd/MM/yyyy"
            />
        );
    }


    if (mode === "range") {
        return (
            <DatePicker
                selectsRange={true}
                startDate={selectedDate[0]}
                endDate={selectedDate[1]}
                onChange={(update) => setSelectedDate(update)}
                dateFormat="dd/MM/yyyy"
            />
        );
    }

    return null;
}

export default CustomDatePicker;