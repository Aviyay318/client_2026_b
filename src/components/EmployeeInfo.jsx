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
                        <div className="employee-info-label">
                            <span className="employee-info-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                                    <path d="M4 21a8 8 0 0 1 16 0" />
                                </svg>
                            </span>
                            <span>ID</span>
                        </div>
                        <strong>{employee.personalId}</strong>
                    </div>

                    <div className="employee-info-item">
                        <div className="employee-info-label">
                            <span className="employee-info-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                                    <path d="M4 21a8 8 0 0 1 16 0" />
                                </svg>
                            </span>
                            <span>Full Name</span>
                        </div>
                        <strong>
                            {employee.firstName}
                            {" "}
                            {employee.lastName}
                        </strong>
                    </div>

                    <div className="employee-info-item">
                        <div className="employee-info-label">
                            <span className="employee-info-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M4 6h16v12H4Z" />
                                    <path d="m4 7 8 6 8-6" />
                                </svg>
                            </span>
                            <span>Email</span>
                        </div>
                        <strong>{employee.email}</strong>
                    </div>

                    <div className="employee-info-item employee-info-item-wide">
                        <div className="employee-info-label">
                            <span className="employee-info-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M6 5c0 7.18 5.82 13 13 13" />
                                    <path d="m6 5 3-2 3 5-3 2" />
                                    <path d="m19 18 2-3-5-3-2 3" />
                                </svg>
                            </span>
                            <span>Phone</span>
                        </div>
                        <strong>{employee.phone}</strong>
                    </div>



                    <div className="employee-info-item employee-info-item-wide">
                        <div className="employee-info-label">
                            <span className="employee-info-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M7 7h10v14H7Z" />
                                    <path d="M9 7a3 3 0 0 1 6 0" />
                                    <path d="M10 13h4" />
                                    <path d="M10 17h4" />
                                </svg>
                            </span>
                            <span>User Type</span>
                        </div>
                        <strong>{employee.userType}</strong>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default EmployeeInfo;
