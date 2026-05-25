const getDisplayName = (user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return user.name ||
        user.fullName ||
        user.businessName ||
        fullName ||
        user.personalId ||
        "Connected user";
};

function RealtimePanel({realtimeInfo, loading, onRefresh}) {
    const connectedUsers = realtimeInfo.connectedUsers || [];

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
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            <div className="connected-users-list">
                <h3>Connected users</h3>

                {!connectedUsers.length && (
                    <div className="admin-state compact">No connected users right now.</div>
                )}

                {connectedUsers.map((user, index) => (
                    <div className="connected-user" key={user.id || user.personalId || user.userName || user.username || index}>
                        <span className="status-dot"></span>
                        <div>
                            <strong>{getDisplayName(user)}</strong>
                            <p>{user.role || user.type || user.userType || "User"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RealtimePanel;
