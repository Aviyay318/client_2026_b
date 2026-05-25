const getDisplayName = (employer) => {
    const fullName = `${employer.firstName || ""} ${employer.lastName || ""}`.trim();

    return employer.businessName ||
        employer.name ||
        employer.fullName ||
        fullName ||
        employer.personalId ||
        "Unknown business";
};

function EmployersTable({employers, selectedEmployerId, onSelectEmployer, onDeleteEmployer, deletingEmployerId, loading}) {
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
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {employers.map((employer, index) => {
                    const employerId = employer.id ?? employer.employerId ?? employer.userId;

                    return (
                        <tr
                            key={employerId ?? employer.personalId ?? employer.userName ?? employer.username ?? index}
                            className={selectedEmployerId === employerId ? "selected" : ""}
                            onClick={() => onSelectEmployer(employer)}
                        >
                            <td>{getDisplayName(employer)}</td>
                            <td>{employer.phone || employer.phoneNumber || "Not available"}</td>
                            <td>{employer.workersCount ?? employer.employeeCount ?? "-"}</td>
                            <td>
                                <button
                                    className="admin-delete-btn"
                                    type="button"
                                    disabled={!employerId || deletingEmployerId === employerId}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDeleteEmployer(employer);
                                    }}
                                >
                                    {deletingEmployerId === employerId ? "Deleting..." : "Delete"}
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default EmployersTable;
