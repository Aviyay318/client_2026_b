function ShiftsTable({shifts}) {

    return (
        <table>
            <thead>
                <tr>
                     <th>Day</th>
                     <th>Date</th>
                     <th>Start Hour</th>
                     <th>End Hour</th>
                     <th>Location</th>
                     <th>Role</th>
                </tr>
            </thead>

            <tbody>

            {shifts.map((shift, index) => (

                <tr key={index}>

                    <td>{shift.day}</td>
                    <td>{shift.date}</td>
                    <td>{shift.startHour}</td>
                    <td>{shift.endHour}</td>
                    <td>{shift.location}</td>
                    <td>{shift.role}</td>

                </tr>
            ))}
            </tbody>

        </table>
    )
}

export default ShiftsTable;