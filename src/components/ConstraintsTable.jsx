function ConstraintsTable({constraints}) {
    const rows = Array.isArray(constraints) ? constraints : [];

    const valueOf = (constraint, keys, fallback = "-") => {
        for (const key of keys) {
            if (constraint?.[key] !== undefined && constraint[key] !== null && constraint[key] !== "") {
                return constraint[key];
            }
        }

        return fallback;
    };

    const formatDateTime = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    return(

        <div className="constraints-table-card manager-glass-panel">
        <table className="constraints-table">
            <thead>
            <tr>
                <th>Employee</th>
                <th>Submitted At</th>
                <th>Shift ID</th>
                <th>Availability</th>
                <th>Comment</th>
            </tr>
            </thead>

        <tbody>
            {rows.map((constraint, index)=>(
                <tr key={index}>
                    <td>{valueOf(constraint, ["employeeName", "employeeId", "employeePersonalId"])}</td>
                    <td>{formatDateTime(valueOf(constraint, ["date", "createdAt", "submittedAt"], ""))}</td>
                    <td>{valueOf(constraint, ["shiftId", "shift_id", "id"])}</td>
                    <td>
                        <span className={constraint.available ? "constraint-status available" : "constraint-status unavailable"}>
                            {constraint.available ? "Available" : "Not available"}
                        </span>
                    </td>
                    <td>{valueOf(constraint, ["comment"], "")}</td>
                </tr>
            ))}
        </tbody>
        </table>
        </div>

)
}

export default ConstraintsTable;
