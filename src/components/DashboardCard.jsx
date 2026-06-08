import "./DashboardCard.css";

function DashboardCard({title, count, employees}){


    return(
        <div className={`dashboard-card dashboard-card-${title.toLowerCase().replaceAll(" ", "-")}`}>
            <div className="dashboard-card-header">
                <span className="dashboard-card-icon" aria-hidden="true"></span>
                <h3>{title}</h3>
            </div>

            <div className="dashboard-card-body">
                <h1>{count}</h1>

                {(title === "Absent Employees" || title === "Left Employees") && (
                    <label className="dashboard-card-select-wrap">
                        <span className="dashboard-card-select-label">Department</span>
                        <select className="dashboard-card-select" defaultValue="all">
                            <option value="all">All Departments</option>
                            {employees?.map((employee, index) => (
                                <option key={employee.id || employee.personalId || index} value={employee.id || employee.personalId || index}>
                                    {employee.firstName} {employee.lastName}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
            </div>

            <span className="dashboard-card-glow" aria-hidden="true"></span>
        </div>
    )
}
export default DashboardCard;
