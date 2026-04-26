import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectRolePage from "./pages/SelectRolePage.jsx";
import EmployeeLoginPage from "./pages/employee/EmployeeLoginPage.jsx";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployerLoginPage from "./pages/employer/EmployerLoginPage.jsx";
import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<SelectRolePage />} />
                <Route path="/employee-login" element={<EmployeeLoginPage />} />
                <Route path="/employer-login" element={<EmployerLoginPage />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/employer-dashboard" element={<EmployerDashboard />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;