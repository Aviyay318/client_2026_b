import "./LocationButton.css";

function LocationButton({ location, setLocation }) {
    return (
        <div className="location-section">
            <h2 className="location-title">Choose work location</h2>

            <div className="location-box">
                <button
                    className={`location-option ${location === "home" ? "active-location" : ""}`}
                    onClick={() => setLocation("home")}
                >
                    🏠 Home
                </button>

                <button
                    className={`location-option ${location === "office" ? "active-location" : ""}`}
                    onClick={() => setLocation("office")}
                >
                    🏢 Office
                </button>

                <button
                    className={`location-option ${location === "site" ? "active-location" : ""}`}
                    onClick={() => setLocation("site")}
                >
                    📍 Site
                </button>
            </div>
        </div>
    );
}

export default LocationButton;