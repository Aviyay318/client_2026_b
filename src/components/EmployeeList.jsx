import {Link} from "react-router-dom";
import "./EmployeeList.css";

function EmployeeList ({employees}){


    return(

        <section className="manager-glass-panel employee-list-panel">

            <div className="manager-section-header">
                <div>
                    <span className="manager-eyebrow">Team Directory</span>
                    <h2>All Employees</h2>
                </div>

                <div className="real-time-count">
                    {employees.length} employees
                </div>
            </div>


            {employees.length === 0 ? (
                <p className="manager-empty-state">No employees found</p>
            ) : (
            <div className="employee-directory-grid">
                {employees.map((employee)=> (

                    <div className="employee-directory-card" key={employee.id}>

                        <Link to={`/employee-details-page/${employee.id}`}>
                            {employee.firstName} {employee.lastName}
                        </Link>

                    </div>
                    ))}
                </div>
                )}

        </section>
    );

}export default EmployeeList;
