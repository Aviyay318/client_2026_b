const getDisplayName = (user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return user.name ||
        user.fullName ||
        fullName ||
        user.personalId ||
        "Worker";
};

function WorkersPanel({employer, workers, loading, error, onClose}) {
    const employerName = employer ? getDisplayName(employer) : "Select employer";

    return (
        <aside className="admin-panel workers-panel">
            <div className="admin-section-header">
                <div>
                    <p>Employer workers</p>
                    <h2>{employerName}</h2>
                </div>
                {employer && (
                    <button className="admin-close-btn" onClick={onClose} type="button">
                        Close
                    </button>
                )}
            </div>

            {!employer && (
                <div className="admin-state">Choose an employer from the table to view workers.</div>
            )}

            {employer && loading && <div className="admin-state">Loading workers...</div>}

            {employer && error && <div className="admin-error">{error}</div>}

            {employer && !loading && !error && !workers.length && (
                <div className="admin-state">No workers found for this employer.</div>
            )}

            {employer && !loading && !error && workers.map((worker, index) => (
                <div className="worker-row" key={worker.id || worker.workerId || worker.personalId || worker.userName || worker.username || worker.name || index}>
                    <div>
                        <strong>{getDisplayName(worker)}</strong>
                        {worker.phone && <p>{worker.phone}</p>}
                    </div>
                    <span className={worker.connected || worker.isConnected ? "worker-status online" : "worker-status"}>
                        {worker.connected || worker.isConnected ? "Connected" : "Offline"}
                    </span>
                </div>
            ))}
        </aside>
    );
}

export default WorkersPanel;
