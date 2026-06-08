import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectRolePage from "./pages/select-role/SelectRolePage.jsx";
import EmployeeLoginPage from "./pages/employee/EmployeeLoginPage.jsx";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployerLoginPage from "./pages/employer/EmployerLoginPage.jsx";
import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";
import WorkHoursPage from "./pages/employee/WorkHoursPage.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import EmployeeShiftsPage from "./pages/employee/EmployeeShiftsPage.jsx";
import EmployeeConstraintsPage from "./pages/employee/EmployeeConstraintsPage.jsx";
import EmployeeFinalShiftsPage from "./pages/employee/EmployeeFinalShiftsPage.jsx";
import EmployeeNotificationsPage from "./pages/employee/EmployeeNotificationsPage.jsx";
import EmployeeManagementPage from "./pages/employer/EmployeeManagementPage.jsx";
import EmployeeListPage from "./pages/employer/EmployeeListPage.jsx";
import EmployeeDetailsListPage from "./pages/employer/EmployeeDetailsListPage.jsx";
import EmployerConstraintsView from "./pages/employer/EmployerConstraintsView.jsx";
import EmployerRequestsPage from "./pages/employer/EmployerRequestsPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SelectRolePage />} />

                <Route path="/employee-login" element={<EmployeeLoginPage />} />
                <Route path="/employer-login" element={<EmployerLoginPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/employer-dashboard" element={<EmployerDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

                <Route path="/work-hours-page" element={<WorkHoursPage />} />
                <Route path="/employee-shifts-page" element={<EmployeeShiftsPage />} />
                <Route path="/employee-constraints" element={<EmployeeConstraintsPage />} />
                <Route path="/employee-final-shifts" element={<EmployeeFinalShiftsPage />} />
                <Route path="/employee-notifications" element={<EmployeeNotificationsPage />} />

                <Route path="/employee-management-page" element={<EmployeeManagementPage />} />
                <Route path="/employee-list-page" element={<EmployeeListPage />} />
                <Route path="/employer-requests" element={<EmployerRequestsPage />} />
                <Route path="/employee-details-page/:id" element={<EmployeeDetailsListPage />}/>
                <Route path="/employer-constraints" element={<EmployerConstraintsView />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
