import "./EmployeeInfo.css";

function EmployeeInfo({ employee }) {

    return (

        <section className="employee-info-section">

            <div className="employee-info-header">
                <span className="employee-info-eyebrow">Employee Profile</span>
                <h2>General Information</h2>
            </div>

            <div className="employee-info-card">
                <div className="employee-info-grid">
                    <div className="employee-info-item">
                        <span>ID</span>
                        <strong>{employee.id}</strong>
                    </div>

                    <div className="employee-info-item">
                        <span>Full Name</span>
                        <strong>
                            {employee.firstName}
                            {" "}
                            {employee.lastName}
                        </strong>
                    </div>

                    <div className="employee-info-item">
                        <span>Email</span>
                        <strong>{employee.email}</strong>
                    </div>

                    <div className="employee-info-item">
                        <span>Phone</span>
                        <strong>{employee.phone}</strong>
                    </div>

                    <div className="employee-info-item">
                        <span>Username</span>
                        <strong>{employee.userName}</strong>
                    </div>

                    <div className="employee-info-item">
                        <span>User Type</span>
                        <strong>{employee.userType}</strong>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default EmployeeInfo;
