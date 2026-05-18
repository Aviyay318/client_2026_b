function RealtimePanel({realtimeInfo, loading}) {
    const connectedUsers = realtimeInfo.connectedUsers || [];

    return (
        <section className="admin-panel realtime-panel">
            <div className="admin-section-header">
                <div>
                    <p>Live status</p>
                    <h2>Realtime Information</h2>
                </div>
                {loading && <span className="admin-refreshing">Refreshing...</span>}
            </div>

            <div className="realtime-summary">
                <div>
                    <span>Connected employers</span>
                    <strong>{realtimeInfo.connectedEmployers ?? 0}</strong>
                </div>
                <div>
                    <span>Connected workers</span>
                    <strong>{realtimeInfo.connectedWorkers ?? 0}</strong>
                </div>
            </div>

            <div className="connected-users-list">
                <h3>Connected users</h3>

                {!connectedUsers.length && (
                    <div className="admin-state compact">No connected users right now.</div>
                )}

                {connectedUsers.map((user, index) => (
                    <div className="connected-user" key={user.id || `${user.username}-${index}`}>
                        <span className="status-dot"></span>
                        <div>
                            <strong>{user.name || user.fullName || user.username || user.userName || user.businessName || "Connected user"}</strong>
                            <p>{user.role || user.type || user.userType || "User"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RealtimePanel;
