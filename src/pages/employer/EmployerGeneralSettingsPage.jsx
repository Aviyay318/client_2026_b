import { useEffect, useState } from "react";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import {
    getEmployerSettings,
    setEmployerSettings
} from "../../service/employerSettingsApi.js";

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

            <div className="employer-general-settings-card">

                <h1>General Settings</h1>

                <h2>מועד אחרון להגשת אילוצים</h2>

                {loading ? (
                    <p>Loading settings...</p>
                ) : (
                    <form onSubmit={saveSettings}>

                        <label>Choose date and time:</label>

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
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    setIsEditMode(true)
                                }
                            >
                                Edit
                            </button>
                        )}

                    </form>
                )}

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

            </div>
        </div>
    );
}

export default EmployerGeneralSettingsPage;
