function SiftsTable({shifts}) {

    return (
        <table>
            <thead>
                <tr>
                     <th>Date</th>
                     <th>Start Hour</th>
                     <th>End Hour</th>
                </tr>
            </thead>
            <tbody>

            {shifts.map((shift, index) => (

                <tr key={index}>

                    <td>{shift.date}</td>
                    <td>{shift.startHour}</td>
                    <td>{shift.endHour}</td>

                </tr>
                ))}
            </tbody>

        </table>
    )
}

export default SiftsTable;