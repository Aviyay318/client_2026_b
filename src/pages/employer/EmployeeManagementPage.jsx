import AddEUserForm from "../../components/AddEUserForm.jsx";
import DeleteEmployee from "../../components/DeleteUser.jsx";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";

function EmployeeManagementPage() {
    return (
        <div className="employee-management-page">
            <NavbarEmployer active="AddRemoveEmployee" />

            <div className="employee-management-content">
                <h1>Employee Management</h1>

                <AddEUserForm />
                <DeleteEmployee />
            </div>
        </div>
    );
}

export default EmployeeManagementPage;