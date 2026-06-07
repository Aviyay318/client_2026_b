function ShiftSettingsTable({
    shifts,
    onChangeShift,
    onAddShift,
    onDeleteShift
}) {

    return (
        <table>

            <thead>
            <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Employees</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>

            {shifts.map((shift) => (
                <tr key={shift.id}>

                    <td>{shift.day}</td>

                    <td>
                        <input
                            type="time"
                            value={shift.startTime}
                            onChange={(event) =>
                                onChangeShift(shift.id, "startTime", event.target.value)
                            }
                        />
                    </td>

                    <td>
                        <input
                            type="time"
                            value={shift.endTime}
                            onChange={(event) =>
                                onChangeShift(shift.id, "endTime", event.target.value)
                            }
                        />
                    </td>

                    <td>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={shift.employeesCount}
                            onChange={(event) =>
                                onChangeShift(shift.id, "employeesCount", event.target.value)
                            }
                        />
                    </td>

                    <td>
                        {shift.isExtra ? (
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
                    </td>

                </tr>
            ))}

            </tbody>

        </table>
    );
}

export default ShiftSettingsTable;
