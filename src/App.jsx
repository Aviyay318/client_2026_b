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
import EmployeeManagementPage from "./pages/employer/EmployeeManagementPage.jsx";

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

                <Route path="/employee-management-page" element={<EmployeeManagementPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
