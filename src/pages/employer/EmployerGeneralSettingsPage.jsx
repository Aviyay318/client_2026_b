import {useEffect, useState} from "react";
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

    const applySettingsResponse = (response) => {
        const serverSettings =
            response.data?.data?.settings
            || response.data?.data
            || response.data?.settings
            || response.data;

        const submissionDeadline =
            serverSettings?.submissionExpiration
            ?? serverSettings?.submitionExparation
            ?? "";

        setSettings({
            submissionExpiration: submissionDeadline,
        });

        setIsEditMode(!submissionDeadline);
    };

    useEffect(() => {
        getEmployerSettings()
            .then((response) => {
                console.log("GET SETTINGS RESPONSE:", response);
                console.log("GET SETTINGS DATA:", response.data);

                applySettingsResponse(response);
            })
            .catch((requestError) => {
                console.log("GET SETTINGS ERROR:", requestError);
                console.log("GET STATUS:", requestError.response?.status);
                console.log("GET DATA:", requestError.response?.data);

                setError("Failed to load settings.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const isFormValid = () => {
        if (settings.submissionExpiration.trim() === "") {
            setError("Please choose a date and time.");
            return false;
        }

        return true;
    };

    const saveSettings = (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!isFormValid()) {
            return;
        }

        console.log("SETTINGS TO SAVE:", settings);
        console.log("REQUEST BODY:", settings);

        setSaving(true);

        setEmployerSettings(settings)
            .then(async (response) => {
                console.log("SAVE RESPONSE:", response);
                console.log("SAVE RESPONSE DATA:", response.data);

                if (response.data?.success === false) {
                    setError("Failed to save settings.");
                    return;
                }

                const refreshedResponse = await getEmployerSettings();
                applySettingsResponse(refreshedResponse);
                setMessage("Settings saved successfully.");
            })
            .catch((requestError) => {
                console.log("SET SETTINGS ERROR:", requestError);
                console.log("STATUS:", requestError.response?.status);
                console.log("DATA:", requestError.response?.data);
                console.log(
                    "DATA STRING:",
                    JSON.stringify(
                        requestError.response?.data,
                        null,
                        2
                    )
                );

                setError("Failed to save settings.");
            })
            .finally(() => {
                setSaving(false);
            });
    };

    return (
        <div className="employer-general-settings-page">
            <NavbarEmployer active="GeneralSettings" />

            <main className="employer-general-settings-main">
                <header className="employer-general-settings-header">
                    <h1>General Settings</h1>
                    <p>Set the deadline for employee constraint submissions.</p>
                </header>

                <section className="employer-general-settings-card">
                    <div className="general-settings-section-heading">
                        <span className="general-settings-section-icon" aria-hidden="true"></span>
                        <div>
                            <h2>Constraint submission deadline</h2>
                            <p>
                                Define the date and time limit for employee constraint submissions.
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
                                    onChange={(event) =>
                                        setSettings({
                                            ...settings,
                                            submissionExpiration: event.target.value,
                                        })
                                    }
                                />

                                {isEditMode ? (
                                    <button
                                        className="general-settings-save-button"
                                        type="submit"
                                        disabled={saving}
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                ) : (
                                    <button
                                        className="general-settings-save-button"
                                        type="button"
                                        onClick={() => setIsEditMode(true)}
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
                                This deadline controls when employees can submit availability constraints.
                                After it passes, employees can view the page but cannot submit new constraints.
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
