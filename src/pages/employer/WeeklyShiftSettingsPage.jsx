import { useEffect, useRef, useState } from "react";
import { formatTimeForServer } from "../../utils/timeUtils.js";
import ShiftSettingsTable from "../../components/ShiftSettingsTable.jsx";
import {
    getEmployerShifts,
    postShifts,
    setShifts
} from "../../service/employerApi.js";

const weekDays = [
    { value: 1, label: "Sunday" },
    { value: 2, label: "Monday" },
    { value: 3, label: "Tuesday" },
    { value: 4, label: "Wednesday" },
    { value: 5, label: "Thursday" },
    { value: 6, label: "Friday" },
    { value: 7, label: "Saturday" }
];

const createDefaultShifts = () => weekDays.map(({ value }, index) => ({
    id: index + 1,
    weekDay: value,
    startTime: "",
    endTime: "",
    employeeAmount: "",
    isExtra: false
}));

const formatTimeForInput = (time) => {
    if (!time) {
        return "";
    }

    const timeMatch = time.match(/(?:T|^)(\d{2}:\d{2})/);
    return timeMatch?.[1] ?? "";
};

const addExtraFlags = (loadedShifts) => {
    const seenDays = new Set();

    return loadedShifts.map((shift, index) => {
        const isExtra = seenDays.has(shift.weekDay);
        seenDays.add(shift.weekDay);

        return {
            ...shift,
            id: shift.id ?? `${shift.weekDay}-${index}`,
            startTime: formatTimeForInput(shift.startTime),
            endTime: formatTimeForInput(shift.endTime),
            employeeAmount: shift.employeeAmount ?? "",
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
    && isFieldEmpty(shift.employeeAmount)
);

const isCompleteShift = (shift) => (
    !isFieldEmpty(shift.startTime)
    && !isFieldEmpty(shift.endTime)
    && !isFieldEmpty(shift.employeeAmount)
);

const hasInvalidTimeRange = (shift) => shift.endTime <= shift.startTime;

const createShiftsPayload = (shifts) => shifts
    .filter((shift) => !isEmptyShift(shift))
    .map(({ weekDay, startTime, endTime, employeeAmount }) => ({
        weekDay,
        startTime :formatTimeForServer(startTime),
        endTime :formatTimeForServer(endTime),
        employeeAmount
    }));

function WeeklyShiftSettingsPage() {
    const [shifts, setShiftRows] = useState(createDefaultShifts);
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const saveLockRef = useRef(false);
    const lastSavedPayloadRef = useRef(null);


    useEffect(() => {
        const loadShifts = async () => {
            try {
                const response = await getEmployerShifts();

                console.log("GET SHIFTS RESPONSE:", response);
                console.log("GET SHIFTS DATA:", response.data);

                if (!response.data.success) {
                    setMessage("Failed to load shift settings.");
                    return;
                }

                const loadedShifts = response.data.shifts;

                console.log("LOADED SHIFTS:", loadedShifts);
                console.log("LOADED SHIFTS LENGTH:", loadedShifts?.length);

                setShiftRows(
                    Array.isArray(loadedShifts) && loadedShifts.length > 0
                        ? addExtraFlags(loadedShifts)
                        : createDefaultShifts()
                );
            } catch (error) {

                console.log("GET SHIFTS ERROR:", error);

                setMessage("Failed to load shift settings.");
            }
        };

        loadShifts();
    }, []);

    const handleShiftChange = (shiftId, field, value) => {
        setShiftRows((currentShifts) => currentShifts.map((shift) => (
            shift.id === shiftId
                ? {
                    ...shift,
                    [field]: field === "employeeAmount" && value !== ""
                        ? Number(value)
                        : value
                }
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
                (shift) => shift.weekDay === selectedShift.weekDay
            );

            updatedShifts.splice(lastDayIndex + 1, 0, {
                id: Date.now(),
                weekDay: selectedShift.weekDay,
                startTime: "",
                endTime: "",
                employeeAmount: "",
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
        console.log("SAVE CLICK", saveLockRef.current);
        if (saveLockRef.current) {
            return;
        }

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

        const payload = {
            shifts: createShiftsPayload(shifts)
        };

        if (JSON.stringify(payload) === JSON.stringify(lastSavedPayloadRef.current)) {
            setMessage("No changes to save.");
            return;
        }

        saveLockRef.current = true;
        setIsSaving(true);
        console.log("LOCKED");

        try {
            console.log(
                "PAYLOAD STRING:",
                JSON.stringify(payload, null, 2)
            );

            const response = await setShifts(payload);

            console.log("SAVE RESPONSE:", response.data);

            if (response.data.success) {
                lastSavedPayloadRef.current = payload;
                setMessage("Shift settings saved successfully.");
            } else {
                setMessage("Failed to save shift settings.");
            }

        } catch (error) {

            console.log("STATUS:", error.response?.status);

            console.log("DATA:", error.response?.data);

            console.log(
                "DATA STRING:",
                JSON.stringify(error.response?.data, null, 2)
            );

            setMessage("Failed to save shift settings.");

        } finally {
            saveLockRef.current = false;
            setIsSaving(false);
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
                weekDays={weekDays}
                onChangeShift={handleShiftChange}
                onAddShift={handleAddShift}
                onDeleteShift={handleDeleteShift}
            />

            <button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={handlePublish}>Publish Shifts</button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default WeeklyShiftSettingsPage;
