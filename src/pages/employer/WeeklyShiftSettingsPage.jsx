import { useEffect, useState } from "react";
import ShiftSettingsTable from "../../components/ShiftSettingsTable.jsx";
import {
    getEmployerShifts,
    postShifts,
    setShifts
} from "../../service/employerApi.js";

const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const createDefaultShifts = () => weekDays.map((day, index) => ({
    id: index + 1,
    day,
    startTime: "",
    endTime: "",
    employeesCount: "",
    isExtra: false
}));

const addExtraFlags = (loadedShifts) => {
    const seenDays = new Set();

    return loadedShifts.map((shift, index) => {
        const isExtra = seenDays.has(shift.day);
        seenDays.add(shift.day);

        return {
            ...shift,
            id: shift.id ?? `${shift.day}-${index}`,
            startTime: shift.startTime ?? "",
            endTime: shift.endTime ?? "",
            employeesCount: shift.employeesCount ?? "",
            isExtra
        };
    });
};

const isFieldEmpty = (value) => value === null
    || value === undefined
    || String(value).trim() === "";

const isEmptyShift = (shift) => (
    isFieldEmpty(shift.startTime)
    && isFieldEmpty(shift.endTime)
    && isFieldEmpty(shift.employeesCount)
);

const isCompleteShift = (shift) => (
    !isFieldEmpty(shift.startTime)
    && !isFieldEmpty(shift.endTime)
    && !isFieldEmpty(shift.employeesCount)
);

const hasInvalidTimeRange = (shift) => shift.endTime <= shift.startTime;

const createShiftsPayload = (shifts) => shifts
    .filter((shift) => !isEmptyShift(shift))
    .map(({ day, startTime, endTime, employeesCount }) => ({
        day,
        startTime,
        endTime,
        employeesCount: Number(employeesCount)
    }));

function WeeklyShiftSettingsPage() {
    const [shifts, setShiftRows] = useState(createDefaultShifts);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadShifts = async () => {
            try {
                const response = await getEmployerShifts();
                const loadedShifts = response.data;

                setShiftRows(
                    Array.isArray(loadedShifts) && loadedShifts.length > 0
                        ? addExtraFlags(loadedShifts)
                        : createDefaultShifts()
                );
            } catch {
                setMessage("Failed to load shift settings.");
            }
        };

        loadShifts();
    }, []);

    const handleShiftChange = (shiftId, field, value) => {
        setShiftRows((currentShifts) => currentShifts.map((shift) => (
            shift.id === shiftId
                ? { ...shift, [field]: value }
                : shift
        )));
    };

    const handleAddShift = (shiftId) => {
        setShiftRows((currentShifts) => {
            const selectedShift = currentShifts.find((shift) => shift.id === shiftId);

            if (!selectedShift) {
                return currentShifts;
            }

            const updatedShifts = [...currentShifts];
            const lastDayIndex = updatedShifts.findLastIndex(
                (shift) => shift.day === selectedShift.day
            );

            updatedShifts.splice(lastDayIndex + 1, 0, {
                id: Date.now(),
                day: selectedShift.day,
                startTime: "",
                endTime: "",
                employeesCount: "",
                isExtra: true
            });

            return updatedShifts;
        });
    };

    const handleDeleteShift = (shiftId) => {
        setShiftRows((currentShifts) => currentShifts.filter(
            (shift) => shift.id !== shiftId || !shift.isExtra
        ));
    };

    const handleSave = async () => {
        const filledShifts = shifts.filter((shift) => !isEmptyShift(shift));

        if (filledShifts.length === 0) {
            setMessage("No shifts to save.");
            return;
        }

        if (filledShifts.some((shift) => !isCompleteShift(shift))) {
            setMessage("Please complete all fields in partially filled shifts.");
            return;
        }

        if (filledShifts.some(hasInvalidTimeRange)) {
            setMessage("End time must be after start time.");
            return;
        }

        try {
            await setShifts(createShiftsPayload(shifts));
            setMessage("Shift settings saved successfully.");
        } catch {
            setMessage("Failed to save shift settings.");
        }
    };

    const handlePublish = async () => {
        try {
            await postShifts();
            setMessage("Shifts published successfully.");
        } catch {
            setMessage("Failed to publish shifts.");
        }
    };

    return (
        <div>

            <h1>Weekly Shift Settings</h1>

            <ShiftSettingsTable
                shifts={shifts}
                onChangeShift={handleShiftChange}
                onAddShift={handleAddShift}
                onDeleteShift={handleDeleteShift}
            />

            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={handlePublish}>Publish Shifts</button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default WeeklyShiftSettingsPage;
