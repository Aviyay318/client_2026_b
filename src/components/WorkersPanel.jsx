import {useMemo, useState} from "react";
import AdminIcon from "./AdminIcon.jsx";

const getDisplayName = (user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return user.name ||
        user.fullName ||
        fullName ||
        user.personalId ||
        "Worker";
};

function WorkersPanel({employer, workers, loading, error, onClose, onCopyValue}) {
    const [searchTerm, setSearchTerm] = useState("");
    const employerName = employer ? getDisplayName(employer) : "Select employer";

    const visibleWorkers = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        if (!normalizedSearchTerm) {
            return workers;
        }

        return workers.filter((worker) => {
            const searchableText = [
                getDisplayName(worker),
                worker.personalId,
                worker.phone,
                worker.email,
                worker.userName,
                worker.username,
            ].filter(Boolean).join(" ").toLowerCase();

            return searchableText.includes(normalizedSearchTerm);
        });
    }, [workers, searchTerm]);

    if (!employer) {
        return null;
    }

    return (
        <div className="admin-workers-backdrop" onClick={onClose}>
            <aside className="admin-panel workers-panel admin-workers-modal" onClick={(event) => event.stopPropagation()}>
                <div className="admin-section-header">
                    <div>
                        <p>Employer workers</p>
                        <h2>{employerName}</h2>
                    </div>
                    <button className="admin-close-btn" onClick={onClose} type="button">
                        <AdminIcon name="close" />
                        Close
                    </button>
                </div>

                {loading && <div className="admin-state">Loading workers...</div>}

                {error && <div className="admin-error">{error}</div>}

                {!loading && !error && Boolean(workers.length) && (
                    <div className="workers-toolbar">
                        <input
                            type="search"
                            value={searchTerm}
                            placeholder="Search workers"
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <span>{visibleWorkers.length} / {workers.length}</span>
                    </div>
                )}

                {!loading && !error && !workers.length && (
                    <div className="admin-state">No workers found for this employer.</div>
                )}

                {!loading && !error && Boolean(workers.length) && !visibleWorkers.length && (
                    <div className="admin-state compact">No workers match your search.</div>
                )}

                {!loading && !error && Boolean(visibleWorkers.length) && (
                    <div className="workers-list">
                        {visibleWorkers.map((worker, index) => (
                            <div className="worker-row" key={worker.id || worker.workerId || worker.personalId || worker.userName || worker.username || worker.name || index}>
                                <div className="worker-row-header">
                                    <strong>{getDisplayName(worker)}</strong>
                                    <span className={worker.connected || worker.isConnected ? "worker-status online" : "worker-status"}>
                                        {worker.connected || worker.isConnected ? "Connected" : "Offline"}
                                    </span>
                                </div>

                                <div className="worker-details">
                                    <div className="worker-detail-row">
                                        <span>ID</span>
                                        <div className="admin-id-cell">
                                            <strong>{worker.personalId || "Not available"}</strong>
                                            {worker.personalId && (
                                                <button
                                                    className="admin-copy-btn icon-only"
                                                    type="button"
                                                    title="Copy worker ID"
                                                    aria-label="Copy worker ID"
                                                    onClick={() => onCopyValue(worker.personalId, "Worker ID")}
                                                >
                                                    <AdminIcon name="copy" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="worker-detail-row">
                                        <span>Phone</span>
                                        <div className="admin-phone-cell">
                                            <strong>{worker.phone || "Not available"}</strong>
                                            {worker.phone && (
                                                <button
                                                    className="admin-copy-btn icon-only"
                                                    type="button"
                                                    title="Copy worker phone"
                                                    aria-label="Copy worker phone"
                                                    onClick={() => onCopyValue(worker.phone, "Worker phone")}
                                                >
                                                    <AdminIcon name="copy" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </aside>
        </div>
    );
}

export default WorkersPanel;
