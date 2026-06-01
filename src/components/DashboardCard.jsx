import "./DashboardCard.css";

function DashboardCard({title, count, employees}){

    return(
        <div className="dashboard-card">

            <h3>{title}</h3>

            <h1>{count}</h1>

            {employees && (
                <div>
                    {employees.map((employee, index) => (
                        <p key={index}>
                            {employee.firstName} {employee.lastName}
                        </p>
                    ))}
                </div>
            )}

        </div>

    )
}
export default DashboardCard;