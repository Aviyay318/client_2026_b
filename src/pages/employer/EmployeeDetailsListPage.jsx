import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getEmployeeById} from "../../service/employerApi.js";
import EmployeeInfo from "../../components/EmployeeInfo.jsx";
import WorkHoursTable from "../../components/WorkHoursTable.jsx";
import "./EmployeeDetailsListPage.css";

function EmployeeDetailsListPage() {

    const [employee, setEmployee] = useState(null);

    const {id} = useParams();

    useEffect(() => {

        getEmployeeById(id)
            .then(response => {
                if(response.data !== null) {
                    setEmployee(response.data);
                }

        })
            .catch(error => console.log(error));
    },[id]);

    return(
        <div className="employee-details-page">

            {employee && (
                <>

            <EmployeeInfo employee={employee} />

            <WorkHoursTable rows={employee.employeeWorkDays || []} />

            </>

            )}

        </div>


    );
}
export default EmployeeDetailsListPage;