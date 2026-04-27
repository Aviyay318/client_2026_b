import "./LoginForm.css";
import {useState} from "react";
import {loginEmployee, loginEmployer} from "../service/AuthApi.js";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";


function LoginForm({role}) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const isValid = () => {
        return id.trim() === "" || password.trim() === "";
    };


    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        const data = {
            id: id,
            password: password
        };
        const requestApi =
            role === "employee" ?
                loginEmployee(data)
                : loginEmployer(data);

        requestApi.then(response => {
            if (response.data.success) {
                Cookies.set("token", response.data.token)
                const path =
                    role === "employee"
                        ? "/employee-dashboard"
                        : "/employer-dashboard";
                navigate(path);
            } else {
                setError("Wrong id or password");
            }


        }).catch(() => {
            setError("Server error, try again");
        })
    }


    return (
        <div className="login-page">
            <div className="login-card">

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
                        <label>Username</label>
                        <div className="input-field">
                            <span className="field-icon">👤</span>
                            <input
                                type="text"
                                value={id}
                                placeholder="Enter your id"
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-field">
                            <span className="field-icon">🔒</span>
                            <input
                                type="password"
                                value={password}
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="login-btn" disabled={isValid()} type="submit">
                        Login <span className="btn-arrow">→</span>
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default LoginForm;