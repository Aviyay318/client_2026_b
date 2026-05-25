import {useState} from "react";

const emptyEmployer = {
    personalId: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    email: "",
};

function AdminEmployerForm({onCreateEmployer, onClose, loading}) {
    const [employer, setEmployer] = useState(emptyEmployer);
    const [message, setMessage] = useState("");

    const updateField = (field, value) => {
        setEmployer((currentEmployer) => ({
            ...currentEmployer,
            [field]: value,
        }));
    };

    const validateEmployer = () => {
        if (!/^\d{1,9}$/.test(employer.personalId.trim())) {
            return "ID must contain up to 9 digits only";
        }

        if (employer.firstName.trim() === "") {
            return "First name is missing";
        }

        if (employer.lastName.trim() === "") {
            return "Last name is missing";
        }

        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!strongPasswordRegex.test(employer.password)) {
            return "Password must include uppercase, lowercase, number, special character, and 8 characters";
        }

        if (!/^\d{10}$/.test(employer.phone.trim())) {
            return "Phone number must contain 10 digits";
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(employer.email.trim())) {
            return "Email is not valid";
        }

        return "";
    };

    const submitEmployer = (event) => {
        event.preventDefault();

        const validationMessage = validateEmployer();

        if (validationMessage) {
            setMessage(validationMessage);
            return;
        }

        onCreateEmployer({
            personalId: employer.personalId.trim(),
            firstName: employer.firstName.trim(),
            lastName: employer.lastName.trim(),
            password: employer.password,
            phone: employer.phone.trim(),
            email: employer.email.trim(),
        })
            .then(() => {
                setEmployer(emptyEmployer);
                setMessage("Employer created successfully");
                onClose();
            })
            .catch((error) => {
                const responseData = error?.response?.data || error?.data;
                const errorMessage =
                    responseData?.message ||
                    responseData?.errorMessage ||
                    responseData?.error ||
                    (responseData?.errorCode ? `Server error code: ${responseData.errorCode}` : "");

                console.log("CREATE EMPLOYER ERROR:", responseData || error);
                setMessage(errorMessage || "Employer creation failed");
            });
    };

    return (
        <div className="admin-modal-backdrop" onClick={onClose}>
            <section className="admin-panel admin-employer-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-section-header">
                <div>
                    <p>Employer management</p>
                    <h2>Create Employer</h2>
                </div>
                <button className="admin-close-btn" type="button" onClick={onClose}>
                    Close
                </button>
            </div>

            <form className="admin-employer-form" onSubmit={submitEmployer}>
                <input
                    type="text"
                    value={employer.personalId}
                    placeholder="ID"
                    onChange={(event) => updateField("personalId", event.target.value)}
                />
                <input
                    type="text"
                    value={employer.firstName}
                    placeholder="First name"
                    onChange={(event) => updateField("firstName", event.target.value)}
                />
                <input
                    type="text"
                    value={employer.lastName}
                    placeholder="Last name"
                    onChange={(event) => updateField("lastName", event.target.value)}
                />
                <input
                    type="password"
                    value={employer.password}
                    placeholder="Password"
                    onChange={(event) => updateField("password", event.target.value)}
                />
                <input
                    type="text"
                    value={employer.phone}
                    placeholder="Phone"
                    onChange={(event) => updateField("phone", event.target.value)}
                />
                <input
                    type="email"
                    value={employer.email}
                    placeholder="Email"
                    onChange={(event) => updateField("email", event.target.value)}
                />

                <button className="admin-primary-btn" type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create employer"}
                </button>
            </form>

            {message && <div className="admin-form-message">{message}</div>}
            </section>
        </div>
    );
}

export default AdminEmployerForm;
