import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectRolePage from "./pages/select-role/SelectRolePage.jsx";
import EmployeeLoginPage from "./pages/employee/EmployeeLoginPage.jsx";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployerLoginPage from "./pages/employer/EmployerLoginPage.jsx";
import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";
import WorkHoursPage from "./pages/employee/WorkHoursPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<SelectRolePage />} />
                <Route path="/employee-login" element={<EmployeeLoginPage />} />
                <Route path="/employer-login" element={<EmployerLoginPage />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/employer-dashboard" element={<EmployerDashboard />} />
                <Route path="/work-hours-page" element={<WorkHoursPage/>} />

            </Routes>
        </BrowserRouter>


    );
}

export default App;