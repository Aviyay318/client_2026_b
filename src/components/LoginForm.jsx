import "../LoginFrome.css";
import { useState } from "react";

function LoginForm({ role }) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const isValid = () => {
        return id.trim() === "" || password.trim() === "";
    };
    // לעשות regex  על id ,password

    const handeleLogin =()=>{



    }

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-icon">🔒</div>

                <h1>Login</h1>
                <p>Please login to continue</p>

                <form onSubmit={handeleLogin} >
                    <input
                        type="text"
                        value={id}
                        placeholder="Enter your username"
                        onChange={(e) => setId(e.target.value)}
                    />

                    <input
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="login-btn" disabled={isValid()} type="submit">
                        Login →
                    </button>
                </form>

            </div>
        </div>
    );
}

export default LoginForm;