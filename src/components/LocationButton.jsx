function LocationButton({ location, setLocation }) {

    return (
        <div>
            <button
                className={location === "home" ? "active" : ""}
                onClick={() => setLocation("home")}
            >
               Home
            </button>

            <button
                className={location === "office" ? "active" : ""}
                onClick={() => setLocation("office")}
            >
                Office
            </button>

            <button
                className={location === "site" ? "active" : ""}
                onClick={() => setLocation("site")}
            >
                Site
            </button>
        </div>
    );
}

export default LocationButton;