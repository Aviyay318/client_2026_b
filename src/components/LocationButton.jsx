import "./LocationButton.css";
import {useState} from "react";

function LocationButton({ location, setLocation, setSelectedSite, sites }) {


    const [isSiteOpen, setIsSiteOpen] =
        useState(false);



    return (

        <div className="location-section">

            <h2 className="location-title">
                Choose work location
            </h2>



            <div className="location-box">

                <button
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
                isSiteOpen && (

                    <div>

                        <button
                            onClick={() =>
                                setIsSiteOpen(false)
                            }
                        >
                            X
                        </button>



                        {
                            sites.map(site => {

                                return (

                                    <div
                                        key={site.id}

                                        onClick={() => {

                                            setSelectedSite(site);

                                            setIsSiteOpen(false);
                                        }}
                                    >
                                        {site.name}
                                    </div>
                                );
                            })
                        }

                    </div>
                )
            }

        </div>
    );
}

export default LocationButton;