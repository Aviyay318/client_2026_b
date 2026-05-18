

function EmployerDashboard() {



    return (
        <div className="employer-dashboard">
            <NavbarEmployer active={"Dashboard"} />
            <div className="employer-dashboard">
                <h1>Employer Dashboard</h1>
                <RealTimeEmployee employees={employeeList}/>

            </div>
        </div>
    );
}
export default EmployerDashboard;