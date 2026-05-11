import "./LocationButton.css";
import { useState } from "react";

function LocationButton({
                            location,
                            setLocation,
                            selectedSite,
                            setSelectedSite,
                            sites = []
                        }) {

    const [isSiteOpen, setIsSiteOpen] = useState(false);

    return (

        <div className="location-section">

            <h2 className="location-title">
                Choose work location
            </h2>

            <div className="location-box">

                <button
                    type="button"
                    className={`location-option ${
                        location === "home"
                            ? "active-location"
                            : ""
                    }`}
                    onClick={() => {

                        setLocation("home");

                        setSelectedSite(null);

                        setIsSiteOpen(false);
                    }}
                >
                    🏠 Home
                </button>

                <button
                    type="button"
                    className={`location-option ${
                        location === "office"
                            ? "active-location"
                            : ""
                    }`}
                    onClick={() => {

                        setLocation("office");

                        setSelectedSite(null);

                        setIsSiteOpen(false);
                    }}
                >
                    🏢 Office
                </button>

                <button
                    type="button"
                    className={`location-option ${
                        location === "site"
                            ? "active-location"
                            : ""
                    }`}
                    onClick={() => {

                        setLocation("site");

                        setIsSiteOpen(true);
                    }}
                >
                    📍 Site
                </button>

            </div>

            {
                location === "site" && selectedSite && (

                    <div className="selected-site-preview">

                        <span className="selected-site-label">
                            Selected site:
                        </span>

                        <span className="selected-site-name">
                            {selectedSite.name}
                        </span>

                    </div>
                )
            }

            {
                isSiteOpen && location === "site" && (

                    <div className="site-dropdown">

                        <div className="site-dropdown-top">

                            <span className="site-dropdown-title">
                                Choose site
                            </span>

                            <button
                                type="button"
                                className="site-close-btn"
                                onClick={() => setIsSiteOpen(false)}
                            >
                                ×
                            </button>

                        </div>

                        <div className="site-list">

                            {
                                sites.length > 0 ? (

                                    sites.map(site => {

                                        const isSelected =
                                            selectedSite &&
                                            selectedSite.id === site.id;

                                        return (

                                            <button
                                                key={site.id}
                                                type="button"
                                                className={`site-item ${
                                                    isSelected
                                                        ? "selected-site-item"
                                                        : ""
                                                }`}
                                                onClick={() => {

                                                    setSelectedSite(site);

                                                    setIsSiteOpen(false);
                                                }}
                                            >
                                                <span className="site-item-left">

                                                    <span className="site-item-icon">
                                                        📍
                                                    </span>

                                                    <span className="site-item-name">
                                                        {site.name}
                                                    </span>

                                                </span>

                                                {
                                                    isSelected && (

                                                        <span className="site-check">
                                                            ✓
                                                        </span>
                                                    )
                                                }

                                            </button>
                                        );
                                    })

                                ) : (

                                    <div className="site-empty-message">
                                        No sites found
                                    </div>
                                )
                            }

                        </div>

                    </div>
                )
            }

        </div>
    );
}

export default LocationButton;