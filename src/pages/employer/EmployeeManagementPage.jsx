import AddUserForm from "../../components/AddUserForm.jsx";
import DeleteEmployee from "../../components/DeleteUser.jsx";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import "./EmployerDashboard.css";

function EmployeeManagementPage() {
    return (
        <div className="manager-dashboard-shell employee-management-page">
            <NavbarEmployer active="AddRemoveEmployee" />

            <div className="manager-dashboard-content employee-management-content">
                <header className="manager-topbar">
                    <div>
                        <span className="manager-eyebrow">WorkSync People Operations</span>
                        <h1>Employee Management</h1>
                        <p>Add new team members or remove employees from the system.</p>
                    </div>
                </header>

                <section className="employee-management-grid">
                    <AddUserForm />
                    <DeleteEmployee />
                </section>
            </div>
        </div>
    );
}

export default EmployeeManagementPage;
