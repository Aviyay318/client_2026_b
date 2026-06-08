import { useEffect, useState } from "react";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import {
    getEmployerSettings,
    setEmployerSettings
} from "../../service/employerSettingsApi.js";
import "./EmployerGeneralSettingsPage.css";

function EmployerGeneralSettingsPage() {
    const [settings, setSettings] = useState({
        submissionExpiration: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isEditMode, setIsEditMode] = useState(true);

    useEffect(() => {
        getEmployerSettings()
            .then((response) => {

                console.log("GET SETTINGS RESPONSE:", response);
                console.log("GET SETTINGS DATA:", response.data);

                const serverSettings =
                    response.data?.settings || response.data;

                console.log("SERVER SETTINGS:", serverSettings);

                if (
                    serverSettings &&
                    serverSettings.submissionExpiration
                ) {
                    setSettings({
                        submissionExpiration:
                        serverSettings.submissionExpiration,
                    });

                    setIsEditMode(false);
                } else {
                    setSettings({
                        submissionExpiration: "",
                    });

                    setIsEditMode(true);
                }
            })
            .catch((error) => {

                console.log("GET SETTINGS ERROR:", error);
                console.log("GET STATUS:", error.response?.status);
                console.log("GET DATA:", error.response?.data);

                setError("Failed to load settings");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const isFormValid = () => {
        if (settings.submissionExpiration.trim() === "") {
            setError("Please choose date and time");
            return false;
        }

        return true;
    };

    const saveSettings = (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!isFormValid()) {
            return;
        }

        console.log("SETTINGS TO SAVE:", settings);
        console.log("REQUEST BODY:", settings);

        setSaving(true);

        setEmployerSettings(settings)
            .then((response) => {

                console.log("SAVE RESPONSE:", response);
                console.log("SAVE RESPONSE DATA:", response.data);

                if (response.data?.success === false) {
                    setError("Failed to save settings");
                    return;
                }

                setMessage("Settings saved successfully");
                setIsEditMode(false);
            })
            .catch((error) => {

                console.log("SET SETTINGS ERROR:", error);
                console.log("STATUS:", error.response?.status);
                console.log("DATA:", error.response?.data);
                console.log(
                    "DATA STRING:",
                    JSON.stringify(
                        error.response?.data,
                        null,
                        2
                    )
                );

                setError("Failed to save settings");
            })
            .finally(() => {
                setSaving(false);
            });
    };

    return (
        <div className="employer-general-settings-page">

            <NavbarEmployer active={"GeneralSettings"} />

            <main className="employer-general-settings-main">
                <header className="employer-general-settings-header">
                    <h1>General Settings</h1>
                    <p>Manage general system settings and constraints</p>
                </header>

                <section className="employer-general-settings-card">
                    <div className="general-settings-section-heading">
                        <span className="general-settings-section-icon" aria-hidden="true"></span>
                        <div>
                            <h2>Constraints Settings</h2>
                            <p>
                                Define the date and time constraints for scheduling and shift management.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="general-settings-state">Loading settings...</p>
                    ) : (
                        <form className="general-settings-form-panel" onSubmit={saveSettings}>

                            <label>Choose date and time:</label>

                            <div className="general-settings-form-row">
                                <input
                                    type="datetime-local"
                                    value={settings.submissionExpiration}
                                    disabled={!isEditMode}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            submissionExpiration:
                                            e.target.value,
                                        })
                                    }
                                />

                                {isEditMode ? (
                                    <button
                                        className="general-settings-save-button"
                                        type="submit"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save"}
                                    </button>
                                ) : (
                                    <button
                                        className="general-settings-save-button"
                                        type="button"
                                        onClick={() =>
                                            setIsEditMode(true)
                                        }
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                        </form>
                    )}

                    <section className="general-settings-info-card">
                        <span className="general-settings-info-icon" aria-hidden="true">i</span>
                        <div>
                            <h3>About Constraints</h3>
                            <p>
                                Set the global date and time limits that will be applied across the system.
                                These constraints help ensure scheduling, availability, and shift assignments
                                follow the defined rules.
                            </p>
                        </div>
                    </section>

                    {error && <p className="general-settings-message general-settings-error">{error}</p>}
                    {message && <p className="general-settings-message general-settings-success">{message}</p>}
                </section>
            </main>
        </div>
    );
}

export default EmployerGeneralSettingsPage;
