function AdminCards({generalInfo, realtimeInfo}) {
    const cards = [
        {
            label: "Total employers",
            value: generalInfo.employersCount,
        },
        {
            label: "Total workers",
            value: generalInfo.workersCount,
        },
        {
            label: "Connected employers",
            value: realtimeInfo.connectedEmployers,
        },
        {
            label: "Connected workers",
            value: realtimeInfo.connectedWorkers,
        },
    ];

    return (
        <div className="admin-cards">
            {cards.map((card) => (
                <div className="admin-stat-card" key={card.label}>
                    <span>{card.label}</span>
                    <strong>{card.value ?? 0}</strong>
                </div>
            ))}
        </div>
    );
}

export default AdminCards;
