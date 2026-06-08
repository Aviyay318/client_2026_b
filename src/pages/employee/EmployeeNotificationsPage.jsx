import NavbarEmployee from "../../Navbar/navbar-employee/NavbarEmployee.jsx";
import "./EmployeeViewPages.css";

function EmployeeNotificationsPage() {
    return (
        <div className="employee-view-page">
            <NavbarEmployee active="Notifications" />

            <header className="employee-view-header">
                <p className="employee-view-kicker">Employee View</p>
                <h1>Notifications</h1>
                <p>Updates, shift changes, and employer messages will appear here.</p>
            </header>

            <section className="employee-view-empty">
                <h2>Notifications center</h2>
                <p>This page is ready for the next backend integration.</p>
            </section>
        </div>
    );
}

export default EmployeeNotificationsPage;
