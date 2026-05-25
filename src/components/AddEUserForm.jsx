import { useState } from "react";
import { createEmployee } from "../service/employerApi.js";
import "./AddEmployeeForm.css";

function AddEUserForm() {
    const [user, setUser] = useState({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        phone: "",
        email: "",

    });

    const [message, setMessage] = useState("");

    const isFormValid = () => {

        if (user.username.trim() === "") {
            setMessage("Username is missing");
            return false;
        }

        if (user.firstName.trim() === "") {
            setMessage("First name is missing");
            return false;
        }

        if (user.lastName.trim() === "") {
            setMessage("Last name is missing");
            return false;
        }

        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (user.password.trim() === "") {
            setMessage("Password is missing");
            return false;
        }

        if (!strongPasswordRegex.test(user.password)) {
            setMessage("Password must be at least 8 characters long and include uppercase, lowercase, numbers, and a special character");
            return false;
        }

        if (!/^\d{10}$/.test(user.phone.trim())) {
            setMessage("Phone number must contain 10 digits");
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (user.email.trim() === "") {
            setMessage("Email is missing");
            return false;
        }

        if (!emailRegex.test(user.email.trim())) {
            setMessage("Email is not valid");
            return false;
        }


        return true;
    };

    const register = (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        createEmployee(user)
            .then((response) => {
                console.log("CREATE EMPLOYEE RESPONSE:", response.data);

                if (response.data?.success === true) {
                    setMessage("The employee was created successfully");

                    setUser({
                        username: "",
                        firstName: "",
                        lastName: "",
                        password: "",
                        phone: "",
                        email: "",
                    });
                } else {
                    setMessage("The registration failed");
                }
            })
            .catch((error) => {
                console.log("CREATE EMPLOYEE ERROR:", error.response?.data || error);
                setMessage("Request failed");
            });
    };

    return (
        <form className="manager-form-card add-employee-form" onSubmit={register}>
            <div className="manager-form-header">
                <span className="manager-eyebrow">New Employee</span>
                <h2>Add Employee</h2>
                <p>Create a profile for a new WorkSync team member.</p>
            </div>

            <div className="manager-form-grid">
                <label>
                    <span>Username</span>
                    <input
                        type="text"
                        value={user.username}
                        placeholder="Enter user name"
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                </label>

                <label>
                    <span>First name</span>
                    <input
                        type="text"
                        value={user.firstName}
                        placeholder="Enter first name"
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    />
                </label>

                <label>
                    <span>Last name</span>
                    <input
                        type="text"
                        value={user.lastName}
                        placeholder="Enter last name"
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    />
                </label>

                <label>
                    <span>Password</span>
                    <input
                        type="password"
                        value={user.password}
                        placeholder="Enter password"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </label>

                <label>
                    <span>Phone</span>
                    <input
                        type="text"
                        value={user.phone}
                        placeholder="Enter phone number"
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                </label>

                <label>
                    <span>Email</span>
                    <input
                        type="email"
                        value={user.email}
                        placeholder="Enter email"
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                </label>
            </div>

            <div className="manager-form-actions">
                <button type="submit">Add Employee</button>
            </div>

            <p className="manager-form-message">{message}</p>
        </form>
    );
}

export default AddEUserForm;
