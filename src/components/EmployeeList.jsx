import {Link} from "react-router-dom";

function EmployeeList ({employees}){


    return(

        <div>

            <h2>Employee List</h2>


            {employees.length === 0 ? (
                <p>No employees found</p>
            ) : (
            employees.map((employee)=> (

                <div key={employee.id}>

                    <Link to={`/employee-details-page/${employee.id}`}>
                    {employee.firstName} {employee.lastName}
                    </Link>

                </div>
                ))
                )}

        </div>
    );

}export default EmployeeList;