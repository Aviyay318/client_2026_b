import {useMemo, useState} from "react";
import AdminIcon from "./AdminIcon.jsx";

const getDisplayName = (employer) => {
    const fullName = `${employer.firstName || ""} ${employer.lastName || ""}`.trim();

    return employer.businessName ||
        employer.name ||
        employer.fullName ||
        fullName ||
        employer.personalId ||
        "Unknown business";
};

const getEmployerId = (employer) => {
    return employer.id ?? employer.employerId ?? employer.userId;
};

const getEmployerPhone = (employer) => {
    return employer.phone || employer.phoneNumber || "";
};

const getWorkersCount = (employer) => {
    return employer.workersCount ?? employer.employeeCount ?? employer.workers?.length ?? employer.employees?.length;
};

function EmployersTable({
    employers,
    selectedEmployerId,
    onSelectEmployer,
    onDeleteEmployer,
    deletingEmployerId,
    disabledDeleteEmployerId,
    loading,
    onAddEmployer,
    onCopyValue,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const visibleEmployers = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        const filteredEmployers = employers.filter((employer) => {
            const searchableText = [
                getDisplayName(employer),
                getEmployerPhone(employer),
                employer.email,
                employer.personalId,
            ].filter(Boolean).join(" ").toLowerCase();

            return searchableText.includes(normalizedSearchTerm);
        });

        return filteredEmployers.sort((firstEmployer, secondEmployer) => {
            if (sortBy === "workers") {
                return Number(getWorkersCount(secondEmployer) ?? 0) - Number(getWorkersCount(firstEmployer) ?? 0);
            }

            if (sortBy === "phone") {
                return getEmployerPhone(firstEmployer).localeCompare(getEmployerPhone(secondEmployer));
            }

            return getDisplayName(firstEmployer).localeCompare(getDisplayName(secondEmployer));
        });
    }, [employers, searchTerm, sortBy]);

    if (loading) {
        return (
            <div className="admin-table-skeleton" aria-label="Loading employers">
                {[0, 1, 2].map((item) => (
                    <div className="admin-skeleton-row" key={item}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ))}
            </div>
        );
    }

    if (!employers.length) {
        return (
            <div className="admin-state admin-empty-state">
                <strong>No employers found.</strong>
                <span>Create the first employer to start managing workers.</span>
                <button className="admin-primary-btn" type="button" onClick={onAddEmployer}>
                    Add employer
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="admin-table-toolbar">
                <input
                    type="search"
                    value={searchTerm}
                    placeholder="Search employers"
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="name">Sort by name</option>
                    <option value="workers">Sort by workers</option>
                    <option value="phone">Sort by phone</option>
                </select>
            </div>

            {!visibleEmployers.length ? (
                <div className="admin-state compact">No employers match your search.</div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Business name</th>
                            <th>ID</th>
                            <th>Phone</th>
                            <th>Workers</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visibleEmployers.map((employer, index) => {
                            const employerId = getEmployerId(employer);
                            const isDeleting = deletingEmployerId === employerId;
                            const isDeleteBlocked = disabledDeleteEmployerId === employerId;

                            return (
                                <tr
                                    key={employerId ?? employer.personalId ?? employer.userName ?? employer.username ?? index}
                                    className={selectedEmployerId === employerId ? "selected" : ""}
                                    onClick={() => onSelectEmployer(employer)}
                                >
                                    <td data-label="Business name">
                                        <div className="admin-employer-identity">
                                            <strong>{getDisplayName(employer)}</strong>
                                        </div>
                                    </td>
                                    <td data-label="ID">
                                        <div className="admin-id-cell">
                                            <span>{employer.personalId || "Not available"}</span>
                                            {employer.personalId && (
                                                <button
                                                    className="admin-copy-btn icon-only"
                                                    type="button"
                                                    title="Copy employer ID"
                                                    aria-label="Copy employer ID"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        onCopyValue(employer.personalId, "Employer ID");
                                                    }}
                                                >
                                                    <AdminIcon name="copy" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td data-label="Phone">
                                        <div className="admin-phone-cell">
                                            <span>{getEmployerPhone(employer) || "Not available"}</span>
                                            {getEmployerPhone(employer) && (
                                                <button
                                                    className="admin-copy-btn icon-only"
                                                    type="button"
                                                    title="Copy employer phone"
                                                    aria-label="Copy employer phone"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        onCopyValue(getEmployerPhone(employer), "Employer phone");
                                                    }}
                                                >
                                                    <AdminIcon name="copy" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td data-label="Workers">{getWorkersCount(employer) ?? "-"}</td>
                                    <td data-label="Actions">
                                        <button
                                            className="admin-delete-btn"
                                            type="button"
                                            disabled={!employerId || isDeleting || isDeleteBlocked}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onDeleteEmployer(employer);
                                            }}
                                        >
                                            <AdminIcon name="delete" />
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default EmployersTable;
