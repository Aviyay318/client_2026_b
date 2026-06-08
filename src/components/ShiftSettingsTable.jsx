function ShiftSettingsTable({
    shifts,
    weekDays,
    onChangeShift,
    onAddShift,
    onDeleteShift,
    mode = "settings",
    renderEmployees,
    emptyMessage = "No shifts to display.",
    getShiftId = (shift) => shift.id
}) {
    const isPlacementMode = mode === "placement";
    const isReadOnlyMode = mode === "readonly";
    const isUpdateMode = mode === "update";
    const isEditableMode = !isPlacementMode && !isReadOnlyMode;
    const showActions = isEditableMode;

    return (
        <table>

            <thead>
            <tr>
                <th>Day</th>
                <th>{isPlacementMode ? "Start" : "Start Time"}</th>
                <th>{isPlacementMode ? "End" : "End Time"}</th>
                <th>Employees</th>
                {showActions && <th>Actions</th>}
            </tr>
            </thead>

            <tbody>

            {(isPlacementMode || isReadOnlyMode) && shifts.length === 0 ? (
                <tr>
                    <td colSpan="4">{emptyMessage}</td>
                </tr>
            ) : shifts.map((shift, shiftIndex) => (
                <tr key={getShiftId(shift, shiftIndex)}>

                    <td>
                        {weekDays.find(
                            (weekDayOption) => weekDayOption.value === shift.weekDay
                        )?.label || (
                            isPlacementMode
                                ? shift.day || shift.date || "Not available"
                                : undefined
                        )}
                    </td>

                    <td>
                        {isPlacementMode || isReadOnlyMode ? (
                            shift.startTime || shift.start_time || "Not available"
                        ) : (
                            <input
                                type="time"
                                value={shift.startTime}
                                onChange={(event) =>
                                    onChangeShift(shift.id, "startTime", event.target.value)
                                }
                            />
                        )}
                    </td>

                    <td>
                        {isPlacementMode || isReadOnlyMode ? (
                            shift.endTime || shift.end_time || "Not available"
                        ) : (
                            <input
                                type="time"
                                value={shift.endTime}
                                onChange={(event) =>
                                    onChangeShift(shift.id, "endTime", event.target.value)
                                }
                            />
                        )}
                    </td>

                    <td>
                        {isPlacementMode ? renderEmployees(shift, shiftIndex) : isReadOnlyMode ? (
                            shift.employeeAmount
                        ) : (
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={shift.employeeAmount}
                                onChange={(event) =>
                                    onChangeShift(shift.id, "employeeAmount", event.target.value)
                                }
                            />
                        )}
                    </td>

                    {showActions && <td>
                        {isUpdateMode ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onAddShift(shift.id)}
                                >
                                    +
                                </button>
                                {!shift.isPlaceholder && (
                                    <button
                                        type="button"
                                        onClick={() => onDeleteShift(shift.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </>
                        ) : shift.isExtra ? (
                            <button
                                type="button"
                                onClick={() => onDeleteShift(shift.id)}
                            >
                                Delete
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onAddShift(shift.id)}
                            >
                                +
                            </button>
                        )}
                    </td>}

                </tr>
            ))}

            </tbody>

        </table>
    );
}

export default ShiftSettingsTable;
