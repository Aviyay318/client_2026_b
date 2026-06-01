import AdminIcon from "./AdminIcon.jsx";

const getDisplayName = (user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return user.name ||
        user.fullName ||
        user.businessName ||
        fullName ||
        user.personalId ||
        "Connected user";
};

const getUserRole = (user) => {
    return user.role || user.type || user.userType || "User";
};

const getRoleClassName = (role) => {
    const normalizedRole = role.toString().toLowerCase();

    if (normalizedRole.includes("employer")) {
        return "employer";
    }

    if (normalizedRole.includes("employee") || normalizedRole.includes("worker")) {
        return "employee";
    }

    return "default";
};

function RealtimePanel({realtimeInfo, loading, lastRefreshed, onRefresh}) {
    const connectedUsers = realtimeInfo.connectedUsers || [];
    const formattedLastRefreshed = lastRefreshed?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <section className="admin-panel realtime-panel">
            <div className="admin-section-header">
                <div>
                    <p>Live status</p>
                    <h2>Realtime Information</h2>
                </div>
                <button
                    className="admin-refresh-btn"
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <AdminIcon name="refresh" />
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {formattedLastRefreshed && (
                <p className="admin-last-refreshed">Last refreshed {formattedLastRefreshed}</p>
            )}

            <div className="connected-users-list">
                <h3>Connected users</h3>

                {!connectedUsers.length && (
                    <div className="admin-state compact">No connected users right now.</div>
                )}

                {connectedUsers.map((user, index) => {
                    const role = getUserRole(user);

                    return (
                        <div className="connected-user" key={user.id || user.personalId || user.userName || user.username || index}>
                            <span className="status-dot"></span>
                            <div>
                                <strong>{getDisplayName(user)}</strong>
                                <span className={`admin-role-badge ${getRoleClassName(role)}`}>
                                    {role}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default RealtimePanel;
