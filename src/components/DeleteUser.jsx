import { useState } from "react";
import { deleteEmployee } from "../service/employerApi.js";
import ConfirmationPopUp from "./ConfirmationPopUp.jsx";
import "./DeleteUser.css";

function DeleteEmployee() {
    const [personalId, setPersonalId] = useState("");
    const [message, setMessage] = useState("");
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const executeDelete = () => {
        console.log("Execute Delete");
        const cleanId = personalId.trim();

        if (!/^\d{1,9}$/.test(cleanId)) {
            setMessage("Id must contain up to 9 digits");
            return;
        }

        const data = {
            personalId: cleanId
        };
        console.log("BEFORE API")

        deleteEmployee(data)
            .then((response) => {
                console.log("DELETE EMPLOYEE RESPONSE:", response.data);

                if (response.data?.success === true) {
                    setMessage("User deletion succeeded");
                    setPersonalId("");
                } else {
                    setMessage("The user deletion failed");
                }
            })
            .catch((error) => {
                console.log("DELETE EMPLOYEE ERROR:", error.response?.data || error);
                setMessage("Request failed");
            });
    };
    const confirmDelete = () => {
        console.log("CONFIRM CLICKED");
        setConfirmOpen(false);
        executeDelete();
    };
    return (
        <>
            <form
                className="manager-form-card delete-employee-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    setConfirmOpen(true);
                }}
            >
                <div className="manager-form-header">
                    <span className="manager-eyebrow danger-eyebrow">
                        Access Control
                    </span>

                    <h2>Delete user</h2>

                    <p>
                        Remove an employee profile by entering the existing user id.
                    </p>
                </div>

                <label>
                    <span>User id</span>

                    <input
                        type="text"
                        value={personalId}
                        placeholder="Enter user id"
                        onChange={(e) => setPersonalId(e.target.value)}
                    />
                </label>

                <div className="manager-form-actions">
                    <button
                        className="delete-employee-button"
                        type="submit"
                    >
                        Delete user
                    </button>
                </div>

                <p className="manager-form-message">
                    {message}
                </p>
            </form>

            <ConfirmationPopUp
                isOpen={isConfirmOpen}
                title="Delete Employee?"
                message="Are you sure you want to delete this employee?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                danger={true}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
            />
        </>
    );
}

export default DeleteEmployee;