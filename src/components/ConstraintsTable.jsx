function ConstraintsTable({constraints}) {
    const rows = Array.isArray(constraints) ? constraints : [];

    return(

        <table>
            <thead>
            <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Shift ID</th>
                <th>Availability</th>
                <th>Comment</th>
            </tr>
            </thead>

        <tbody>
            {rows.map((constraint, index)=>(
                <tr key={index}>
                    <td>{constraint.employeeName}</td>
                    <td>{constraint.date}</td>
                    <td>{constraint.shift_id}</td>
                    <td>{constraint.available ? "Available" : "Not available"}</td>
                    <td>{constraint.comment}</td>
                </tr>
            ))}
        </tbody>
        </table>

)
}

export default ConstraintsTable;
