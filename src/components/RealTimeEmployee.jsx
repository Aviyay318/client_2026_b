function RealTimeEmployee({employees}) {


    return (
        <div className="real-time-employees">

            <h2>Real Time Employees</h2>

            <table className="employees-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Start Time</th>
                    <th>Estimated departure time</th>
                </tr>
                </thead>

                <tbody>
                {employees.length === 0 ? (
                    <tr>
                        <td colSpan="5">
                            No active employees found
                        </td>
                    </tr>
                ) : (
                    employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.phone}</td>
                            <td>{employee.location}</td>
                            <td>{employee.startTime}</td>
                            <td>{employee.Estimateddeparturetime}</td>
                            {/*לשאול את בתיה איך הם קראו למשתנה באובייקט של הEMPLOYEE שעת יציאה משוערת*/}
                        </tr>
                    ))
                )}
                </tbody>
            </table>

        </div>
    );
}
export default RealTimeEmployee