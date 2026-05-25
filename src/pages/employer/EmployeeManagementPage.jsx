import AddUserForm from "../../components/AddUserForm.jsx";
import DeleteEmployee from "../../components/DeleteUser.jsx";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";

function EmployeeManagementPage() {
    return (
        <div className="employee-management-page">
            <NavbarEmployer active="AddRemoveEmployee" />

            <div className="employee-management-content">
                <h1>Employee Management</h1>

                <AddUserForm />
                <DeleteEmployee />
            </div>
        </div>
    );
}

export default EmployeeManagementPage;