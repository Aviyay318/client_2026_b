import "../SelectRolePage.css";
import { useNavigate } from "react-router-dom";

function SelectRolePage() {
    const navigate = useNavigate();

    const goToLoginManagement = () => {
        navigate("/employer-login");
    };

    const goToLoginWorker = () => {
        navigate("/employee-login");
    };

    return (
        <div className="select-role-page">
            <div className="background-circle circle-one"></div>
            <div className="background-circle circle-two"></div>

            <div className="role-header">
                <div className="main-icon">
                    <div className="welcome-people-icon">
                        <span className="welcome-person welcome-left"></span>
                        <span className="welcome-person welcome-center"></span>
                        <span className="welcome-person welcome-right"></span>
                    </div>
                </div>

                <p className="welcome-text">Welcome to</p>
                <h1>WFM</h1>

                <p className="subtitle">
                    Manage employees, schedules and roles <br />
                    in one smart place
                </p>
            </div>

            <div className="role-card">
                <p className="choose-text">
                    Choose your <span>role</span> to continue
                </p>

                <button className="role-box manager-box" onClick={goToLoginManagement}>
                    <div className="role-left">
                        <div className="role-icon">💼</div>
                        <div>
                            <h2>Manager</h2>
                            <p>Access management dashboard</p>
                        </div>
                    </div>
                    <div className="arrow">›</div>
                </button>

                <button className="role-box employee-box" onClick={goToLoginWorker}>
                    <div className="role-left">
                        <div className="role-icon">👤</div>
                        <div>
                            <h2>Employee</h2>
                            <p>Access your schedule and shifts</p>
                        </div>
                    </div>
                    <div className="arrow">›</div>
                </button>
            </div>
        </div>
    );
}

export default SelectRolePage;