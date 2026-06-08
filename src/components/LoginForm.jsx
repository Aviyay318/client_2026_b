import "./LoginForm.css";
import {useState} from "react";
import {loginAdmin, loginEmployee, loginEmployer} from "../service/authApi.js";
import {useNavigate} from "react-router-dom";

function LoginForm({role}) {
    const [personalId, setPersonalId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isValid = () => (
        personalId.trim() === ""
        || !/^\d{1,9}$/.test(personalId.trim())
        || password.trim() === ""
    );

    const handleLogin = (event) => {
        event.preventDefault();
        setError("");

        const data = {
            personalId,
            password,
        };

        const requestApi =
            role === "employee"
                ? loginEmployee(data)
                : role === "admin"
                    ? loginAdmin(data)
                    : loginEmployer(data);

        requestApi
            .then((response) => {
                if (response.data.success) {
                    if (role === "admin") {
                        sessionStorage.setItem("adminLoggedIn", "true");
                    }

                    if (role === "employee") {
                        sessionStorage.setItem("employeePersonalId", personalId.trim());
                    }

                    const path =
                        role === "employee"
                            ? "/employee-dashboard"
                            : role === "admin"
                                ? "/admin/dashboard"
                                : "/employer-dashboard";

                    navigate(path);
                } else {
                    setError("Wrong ID or password");
                }
            })
            .catch(() => {
                setError("Server error, try again");
            });
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <button className="back-btn" type="button" onClick={() => navigate("/")}>
                    Back
                </button>

                <div className="login-header">
                    <div className="main-icon people-logo">
                        <div className="people-wrapper">
                            <div className="person side left"></div>
                            <div className="person side right"></div>
                            <div className="person main"></div>
                        </div>
                    </div>

                    <h1>Login</h1>
                    <p className="login-subtitle">Please login to continue</p>
                    <div className="role-badge">Login as {role}</div>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>ID</label>

                        <div className="input-field">
                            <span className="field-icon">ID</span>

                            <input
                                type="text"
                                value={personalId}
                                placeholder="Enter your ID"
                                onChange={(event) => setPersonalId(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>

                        <div className="input-field">
                            <span className="field-icon">PW</span>

                            <input
                                type="password"
                                value={password}
                                placeholder="Enter your password"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                    </div>

                    <button className="login-btn" disabled={isValid()} type="submit">
                        Login <span className="btn-arrow">&gt;</span>
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default LoginForm;
