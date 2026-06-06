import { useEffect, useState } from "react";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import { getEmployerSettings, setEmployerSettings } from "../../service/employerSettingsApi.js";

function EmployerGeneralSettingsPage() {
    const [settings, setSettings] = useState({
        submitionExparation: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isEditMode, setIsEditMode] = useState(true);

    useEffect(() => {
        getEmployerSettings()
            .then((response) => {
                const serverSettings = response.data?.settings || response.data;

                if (serverSettings && serverSettings.submitionExparation) {
                    setSettings({
                        submitionExparation: serverSettings.submitionExparation,
                    });

                    setIsEditMode(false);
                } else {
                    setSettings({
                        submitionExparation: "",
                    });

                    setIsEditMode(true);
                }
            })
            .catch((error) => {
                console.log("GET SETTINGS ERROR:", error);
                setError("Failed to load settings");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const isFormValid = () => {
        if (settings.submitionExparation.trim() === "") {
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

        setSaving(true);

        setEmployerSettings(settings)
            .then((response) => {
                if (response.data?.success === false) {
                    setError("Failed to save settings");
                    return;
                }

                setMessage("Settings saved successfully");
                setIsEditMode(false);
            })
            .catch((error) => {
                console.log("SET SETTINGS ERROR:", error);
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
                            value={settings.submitionExparation}
                            disabled={!isEditMode}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    submitionExparation: e.target.value,
                                })
                            }
                        />

                        {isEditMode ? (
                            <button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditMode(true)}
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