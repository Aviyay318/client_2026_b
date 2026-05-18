import { useState } from "react";
import { deleteEmployee } from "../service/employerApi.js";

function DeleteEmployee() {
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("");

    const removeUser = (e) => {
        e.preventDefault();

        const cleanId = userId.trim();

        if (!/^\d{1,9}$/.test(cleanId)) {
            setMessage("Id must contain up to 9 digits");
            return;
        }

        const data = {
            id: cleanId
        };

        deleteEmployee(data)
            .then((response) => {
                console.log("DELETE EMPLOYEE RESPONSE:", response.data);

                if (response.data?.success === true) {
                    setMessage("User deletion succeeded");
                    setUserId("");
                } else {
                    setMessage("The user deletion failed");
                }
            })
            .catch((error) => {
                console.log("DELETE EMPLOYEE ERROR:", error.response?.data || error);
                setMessage("Request failed");
            });
    };

    return (
        <form onSubmit={removeUser}>
            <h2>Delete user</h2>

            <input
                type="text"
                value={userId}
                placeholder="Enter user id"
                onChange={(e) => setUserId(e.target.value)}
            />

            <button type="submit">
                Delete user
            </button>

            <p>{message}</p>
        </form>
    );
}

export default DeleteEmployee;