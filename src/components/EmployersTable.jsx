function EmployersTable({employers, selectedEmployerId, onSelectEmployer, loading}) {
    if (loading) {
        return <div className="admin-state">Loading employers...</div>;
    }

    if (!employers.length) {
        return <div className="admin-state">No employers found.</div>;
    }

    return (
        <div className="admin-table-wrap">
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Business name</th>
                    <th>Phone</th>
                    <th>Workers</th>
                </tr>
                </thead>
                <tbody>
                {employers.map((employer, index) => (
                    <tr
                        key={employer.id ?? employer.employerId ?? employer.username ?? index}
                        className={selectedEmployerId === (employer.id ?? employer.employerId) ? "selected" : ""}
                        onClick={() => onSelectEmployer(employer)}
                    >
                        <td>{employer.businessName || employer.name || employer.username || employer.userName || "Unknown business"}</td>
                        <td>{employer.phone || employer.phoneNumber || "Not available"}</td>
                        <td>{employer.workersCount ?? employer.employeeCount ?? "-"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployersTable;
