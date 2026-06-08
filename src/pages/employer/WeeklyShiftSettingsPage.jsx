import { useEffect, useRef, useState } from "react";
import {
    formatTimeForInput,
    formatTimeForServer
} from "../../utils/timeUtils.js";
import ShiftSettingsTable from "../../components/ShiftSettingsTable.jsx";
import "./WeeklyShiftSettingsPage.css";
import {
    deleteShift,
    getEmployerShifts,
    postShifts,
    setShifts,
    updateShifts
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

const createDefaultShift = (weekDay) => ({
    id: `default-${weekDay}`,
    weekDay,
    startTime: "",
    endTime: "",
    employeeAmount: "",
    isExtra: false,
    isPlaceholder: true,
    isNew: true
});

const mergeShiftsWithWeekDays = (currentShifts) => weekDays.flatMap(({ value }) => {
    const dayShifts = currentShifts.filter((shift) => shift.weekDay === value);

    if (dayShifts.length === 0) {
        return [createDefaultShift(value)];
    }

    return dayShifts.map((shift, index) => ({
        ...shift,
        isExtra: index > 0,
        isPlaceholder: shift.isPlaceholder ?? false
    }));
});

const createNewShift = (weekDay) => ({
    id: Date.now(),
    weekDay,
    startTime: "",
    endTime: "",
    employeeAmount: "",
    isExtra: true,
    isPlaceholder: false,
    isNew: true
});

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
            isExtra,
            isPlaceholder: false,
            isNew: false
        };
    });
};

const fetchEmployerShiftRows = async () => {
    const response = await getEmployerShifts();

    console.log("GET SHIFTS RESPONSE:", response);
    console.log("GET SHIFTS DATA:", response.data);

    if (!response.data.success) {
        throw new Error("Failed to load shift settings.");
    }

    const loadedShifts = response.data.shifts;

    console.log("LOADED SHIFTS:", loadedShifts);
    console.log("LOADED SHIFTS LENGTH:", loadedShifts?.length);

    const normalizedShifts = Array.isArray(loadedShifts)
        ? addExtraFlags(loadedShifts)
        : [];

    console.log(
        "EXISTING SHIFT IDS:",
        normalizedShifts.map((shift) => shift.id)
    );

    return normalizedShifts;
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

const hasInvalidTimeRange = (shift) => (
    !isEmptyShift(shift) && shift.endTime <= shift.startTime
);

const createShiftsPayload = (shifts) => shifts
    .filter((shift) => !isEmptyShift(shift))
    .map(({ weekDay, startTime, endTime, employeeAmount }) => ({
        weekDay,
        startTime :formatTimeForServer(startTime),
        endTime :formatTimeForServer(endTime),
        employeeAmount
    }));

const createUpdatePayload = ({
    id,
    weekDay,
    startTime,
    endTime,
    employeeAmount
}) => ({
    id,
    weekDay,
    startTime: formatTimeForServer(startTime),
    endTime: formatTimeForServer(endTime),
    employeeAmount
});

function WeeklyShiftSettingsPage() {
    const [shifts, setShiftRows] = useState([]);
    const [savedShifts, setSavedShifts] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const saveLockRef = useRef(false);
    const lastSavedPayloadRef = useRef(null);

    useEffect(() => {
        const loadShifts = async () => {
            try {
                const normalizedShifts = await fetchEmployerShiftRows();
                setSavedShifts(normalizedShifts);
                setShiftRows(normalizedShifts);
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

            const newShift = createNewShift(selectedShift.weekDay);

            console.log("NEW SHIFT ID:", newShift.id);

            updatedShifts.splice(
                lastDayIndex + 1,
                0,
                newShift
            );

            return updatedShifts;
        });
    };

    const handleDeleteShift = async (shiftId) => {
        const selectedShift = shifts.find((shift) => shift.id === shiftId);

        if (!selectedShift) {
            return;
        }

        if (!selectedShift.isNew) {
            try {
                console.log("DELETE SHIFT ID:", shiftId);
                const response = await deleteShift(shiftId);

                if (response.data?.success === false) {
                    setMessage("Failed to delete shift.");
                    return;
                }

                setSavedShifts((currentShifts) => currentShifts.filter(
                    (shift) => shift.id !== shiftId
                ));
            } catch (error) {
                console.log("DELETE SHIFT ERROR:", error.response?.data || error);
                setMessage("Failed to delete shift.");
                return;
            }
        }

        setShiftRows((currentShifts) => mergeShiftsWithWeekDays(
            currentShifts.filter((shift) => shift.id !== shiftId)
        ));
    };

    const handleUpdateMode = () => {
        setShiftRows(mergeShiftsWithWeekDays(savedShifts));
        setIsUpdateMode(true);
    };

    const handleSave = async () => {
        console.log("SAVE CLICK", saveLockRef.current);
        if (saveLockRef.current) {
            return;
        }

        const filledShifts = shifts.filter((shift) => !isEmptyShift(shift));

        console.log("FILLED SHIFTS", filledShifts);
        console.log(
            "PARTIAL CHECK",
            filledShifts.some((shift) => !isCompleteShift(shift))
        );
        console.log(
            "INVALID TIME CHECK",
            filledShifts.some(hasInvalidTimeRange)
        );
        filledShifts.forEach((shift) => {
            console.log(
                "SHIFT:",
                shift.id,
                "START:",
                shift.startTime,
                "END:",
                shift.endTime,
                "INVALID:",
                hasInvalidTimeRange(shift)
            );
        });

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
            const existingShiftPayloads = filledShifts
                .filter((shift) => !shift.isNew)
                .map(createUpdatePayload);
            const newShiftPayload = {
                shifts: createShiftsPayload(
                    filledShifts.filter((shift) => shift.isNew)
                )
            };

            console.log(
                "EXISTING SHIFT IDS:",
                existingShiftPayloads.map((shift) => shift.id)
            );
            console.log(
                "NEW SHIFT IDS:",
                filledShifts
                    .filter((shift) => shift.isNew)
                    .map((shift) => shift.id)
            );

            console.log(
                "PAYLOAD STRING:",
                JSON.stringify(payload, null, 2)
            );

            const updateRequests = existingShiftPayloads.map((updatePayload) => {
                console.log("UPDATE SHIFTS PAYLOAD:", updatePayload);
                return updateShifts(updatePayload);
            });

            const requests = [...updateRequests];

            if (newShiftPayload.shifts.length > 0) {
                console.log("SET SHIFTS PAYLOAD:", newShiftPayload);
                requests.push(setShifts(newShiftPayload));
            }

            const responses = await Promise.all(requests);

            if (responses.some((response) => response.data?.success === false)) {
                setMessage("Failed to save shift settings.");
                return;
            }

            lastSavedPayloadRef.current = payload;
            const refreshedShifts = await fetchEmployerShiftRows();
            setSavedShifts(refreshedShifts);
            setShiftRows(mergeShiftsWithWeekDays(refreshedShifts));
            setMessage("Shift settings saved successfully.");
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
        <div className="weekly-shift-settings-page">

            <div className="weekly-shift-settings-header">
                <h1>Weekly Shift Settings</h1>
            </div>

            <section className="weekly-shift-settings-card">
                <ShiftSettingsTable
                    shifts={shifts}
                    weekDays={weekDays}
                    mode={isUpdateMode ? "update" : "readonly"}
                    onChangeShift={handleShiftChange}
                    onAddShift={handleAddShift}
                    onDeleteShift={handleDeleteShift}
                />

                <div className="weekly-shift-settings-actions">
                    {isUpdateMode ? (
                        <button
                            className="weekly-shift-settings-button weekly-shift-settings-button-secondary"
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    ) : (
                        <button
                            className="weekly-shift-settings-button weekly-shift-settings-button-secondary"
                            type="button"
                            onClick={handleUpdateMode}
                        >
                            Update
                        </button>
                    )}
                    <button
                        className="weekly-shift-settings-button weekly-shift-settings-button-primary"
                        type="button"
                        onClick={handlePublish}
                    >
                        Publish Shifts
                    </button>
                </div>

                {message && <p className="weekly-shift-settings-message">{message}</p>}
            </section>
        </div>
    );
}

export default WeeklyShiftSettingsPage;
