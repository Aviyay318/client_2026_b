function EmployeeInfo({ employee }) {

    return (

        <div>

            <h2>General Information</h2>

            <p>ID: {employee.id}</p>

            <p>
                Full Name:
                {" "}
                {employee.firstName}
                {" "}
                {employee.lastName}
            </p>

            <p>Email: {employee.email}</p>

            <p>Phone: {employee.phone}</p>

            <p>Username: {employee.userName}</p>

            <p>User Type: {employee.userType}</p>

        </div>
    );
}

export default EmployeeInfo;