import "./RealTimeEmployee.css";
import dayjs from "dayjs";

function RealTimeEmployee({employees}) {
    console.log("EMPLOYEEE", employees);
    console.log("FIrstEmployee", employees[0]);


    return (
        <section className="real-time-employees manager-glass-panel">
            <div className="manager-section-header">
                <div>
                    <span className="manager-eyebrow">Live Workforce</span>
                    <h2>Active Employees</h2>
                </div>

                <div className="real-time-count">
                    {employees.length} active
                </div>
            </div>

            <div className="table-area manager-table-area">
                <table className="work-hours-table employees-table manager-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Start Time</th>
                        <th>Estimated Departure</th>
                    </tr>
                    </thead>

                    <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td className="no-data manager-no-data" colSpan="5">
                                No active employees found
                            </td>
                        </tr>
                    ) : (
                        employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>
                                    <span className="employee-name-cell">
                                        <span className="employee-status-dot"></span>
                                        {employee.employee.firstName } -  {employee.employee.lastName}
                                    </span>
                                </td>
                                <td>{employee.employee.phone}</td>
                                <td>{employee.location}</td>
                                <td className="manager-start-time">{dayjs(employee.startTime).format("DD/MM/YYYY")}</td>
                                <td>{employee.Estimateddeparturetime}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
export default RealTimeEmployee
