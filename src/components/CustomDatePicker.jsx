import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CustomDatePicker({
                              mode,
                              selectedDate,
                              setSelectedDate,
                              startDate,
                              setStartDate,
                              endDate,
                              setEndDate
                          }) {

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
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                    setStartDate(update[0]);
                    setEndDate(update[1]);
                }}
                dateFormat="dd/MM/yyyy"
            />
        );
    }

    return null;
}

export default CustomDatePicker
