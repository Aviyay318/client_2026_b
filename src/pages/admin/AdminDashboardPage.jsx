import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import AdminCards from "../../components/AdminCards.jsx";
import AdminEmployerForm from "../../components/AdminEmployerForm.jsx";
import AdminIcon from "../../components/AdminIcon.jsx";
import ConfirmationPopUp from "../../components/ConfirmationPopUp.jsx";
import EmployersTable from "../../components/EmployersTable.jsx";
import RealtimePanel from "../../components/RealtimePanel.jsx";
import WorkersPanel from "../../components/WorkersPanel.jsx";
import {
    createEmployer,
    deleteEmployer,
    getEmployerWorkers,
    getEmployersList,
    getGeneralInfo,
    getRealtimeInfo
} from "../../service/adminApi.js";
import {logout} from "../../service/authApi.js";
import "./AdminDashboardPage.css";

const emptyGeneralInfo = {
    employersCount: 0,
    workersCount: 0,
};

const emptyRealtimeInfo = {
    connectedEmployers: 0,
    connectedWorkers: 0,
    connectedUsers: [],
};

const readPayload = (response) => {
    return response.data?.data || response.data?.result || response.data;
};

const normalizeEmployers = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.employers || payload?.employersList || payload?.users || payload?.items || [];
};

const normalizeWorkers = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.workers || payload?.employees || payload?.users || payload?.items || [];
};

const isEmployerRole = (role) => {
    return role?.toString().toLowerCase().includes("employer");
};

const isWorkerRole = (role) => {
    const normalizedRole = role?.toString().toLowerCase();
    return normalizedRole?.includes("worker") || normalizedRole?.includes("employee");
};

const normalizeGeneralInfo = (payload) => {
    const users = payload?.users || payload?.items || [];
    const employersCountFromUsers = users.filter((user) => (
        isEmployerRole(user.role || user.type || user.userType)
    )).length;
    const workersCountFromUsers = users.filter((user) => (
        isWorkerRole(user.role || user.type || user.userType)
    )).length;

    return {
        employersCount: payload?.employersCount ?? payload?.totalEmployers ?? payload?.employerCount ?? payload?.countEmployers ?? employersCountFromUsers,
        workersCount: payload?.workersCount ?? payload?.totalWorkers ?? payload?.workerCount ?? payload?.employeeCount ?? payload?.employeesCount ?? workersCountFromUsers,
    };
};

const normalizeRealtimeInfo = (payload) => {
    const connectedUsers = payload?.connectedUsers || payload?.users || [];
    const connectedEmployersFromUsers = connectedUsers.filter((user) => (
        isEmployerRole(user.role || user.type || user.userType)
    )).length;
    const connectedWorkersFromUsers = connectedUsers.filter((user) => (
        isWorkerRole(user.role || user.type || user.userType)
    )).length;

    return {
        connectedEmployers: payload?.connectedEmployers ?? payload?.onlineEmployers ?? connectedEmployersFromUsers,
        connectedWorkers: payload?.connectedWorkers ?? payload?.onlineWorkers ?? connectedWorkersFromUsers,
        connectedUsers,
    };
};

const getUserDisplayName = (user, fallback = "user") => {
    const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    return user?.businessName ||
        user?.name ||
        user?.fullName ||
        fullName ||
        user?.personalId ||
        fallback;
};

const getUserId = (user) => {
    return user?.id ?? user?.employerId ?? user?.userId;
};

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [generalInfo, setGeneralInfo] = useState(emptyGeneralInfo);
    const [realtimeInfo, setRealtimeInfo] = useState(emptyRealtimeInfo);
    const [employers, setEmployers] = useState([]);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [refreshingOverview, setRefreshingOverview] = useState(false);
    const [loadingRealtime, setLoadingRealtime] = useState(false);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [creatingEmployer, setCreatingEmployer] = useState(false);
    const [deletingEmployerId, setDeletingEmployerId] = useState(null);
    const [isCreateEmployerOpen, setCreateEmployerOpen] = useState(false);
    const [employerPendingDelete, setEmployerPendingDelete] = useState(null);
    const [isLogoutPending, setLogoutPending] = useState(false);
    const [overviewError, setOverviewError] = useState("");
    const [workersError, setWorkersError] = useState("");
    const [toast, setToast] = useState(null);
    const [lastRealtimeRefresh, setLastRealtimeRefresh] = useState(null);
    const workersRequestIdRef = useRef(0);

    const showToast = useCallback((message, type = "success") => {
        setToast({message, type});
    }, []);

    const updateOverview = useCallback((generalResponse, employersResponse) => {
        const nextGeneralInfo = normalizeGeneralInfo(readPayload(generalResponse));
        const nextEmployers = normalizeEmployers(readPayload(employersResponse));

        return Promise.all(nextEmployers.map((employer) => {
            const employerId = employer.id ?? employer.employerId ?? employer.userId;

            if (!employerId) {
                return Promise.resolve(employer);
            }

            return getEmployerWorkers(employerId)
                .then((response) => ({
                    ...employer,
                    workersCount: normalizeWorkers(readPayload(response)).length,
                }))
                .catch(() => employer);
        })).then((employersWithWorkersCount) => {
            const derivedWorkersCount = employersWithWorkersCount.reduce((total, employer) => (
                total + Number(employer.workersCount ?? employer.employeeCount ?? employer.workers?.length ?? employer.employees?.length ?? 0)
            ), 0);

            setGeneralInfo({
                employersCount: nextGeneralInfo.employersCount || employersWithWorkersCount.length,
                workersCount: nextGeneralInfo.workersCount || derivedWorkersCount,
            });
            setEmployers(employersWithWorkersCount);

            setSelectedEmployer((currentSelectedEmployer) => {
                const selectedEmployerId = getUserId(currentSelectedEmployer);

                if (selectedEmployerId && !employersWithWorkersCount.some((employer) => getUserId(employer) === selectedEmployerId)) {
                    setWorkers([]);
                    setWorkersError("");
                    return null;
                }

                return currentSelectedEmployer;
            });
        });
    }, []);

    const refreshOverview = useCallback(() => {
        return Promise.all([getGeneralInfo(), getEmployersList()])
            .then(([generalResponse, employersResponse]) => {
                return updateOverview(generalResponse, employersResponse);
            });
    }, [updateOverview]);

    const fetchRealtimeInfo = useCallback((showSuccessToast = false) => {
        setLoadingRealtime(true);

        return getRealtimeInfo()
            .then((response) => {
                setRealtimeInfo(normalizeRealtimeInfo(readPayload(response)));
                setLastRealtimeRefresh(new Date());

                if (showSuccessToast) {
                    showToast("Realtime information refreshed.");
                }
            })
            .catch(() => {
                setRealtimeInfo(emptyRealtimeInfo);
                showToast("Could not refresh realtime information.", "error");
            })
            .finally(() => setLoadingRealtime(false));
    }, [showToast]);

    useEffect(() => {
        if (sessionStorage.getItem("adminLoggedIn") !== "true") {
            navigate("/admin/login");
            return;
        }

        refreshOverview()
            .catch(() => {
                setOverviewError("Could not load admin overview. Please try again.");
            })
            .finally(() => setLoadingOverview(false));

        const realtimeTimeoutId = setTimeout(() => fetchRealtimeInfo(false), 0);

        return () => clearTimeout(realtimeTimeoutId);
    }, [navigate, refreshOverview, fetchRealtimeInfo]);

    useEffect(() => {
        if (!toast) {
            return undefined;
        }

        const timeoutId = setTimeout(() => setToast(null), 3000);

        return () => clearTimeout(timeoutId);
    }, [toast]);

    const handleSelectEmployer = (employer) => {
        const employerId = getUserId(employer);
        const workersRequestId = workersRequestIdRef.current + 1;

        workersRequestIdRef.current = workersRequestId;

        if (!employerId) {
            setWorkersError("Employer id is missing.");
            setSelectedEmployer(employer);
            setWorkers([]);
            return;
        }

        setSelectedEmployer(employer);
        setWorkers([]);
        setWorkersError("");
        setLoadingWorkers(true);

        getEmployerWorkers(employerId)
            .then((response) => {
                if (workersRequestIdRef.current !== workersRequestId) {
                    return;
                }

                setWorkers(normalizeWorkers(readPayload(response)));
            })
            .catch(() => {
                if (workersRequestIdRef.current !== workersRequestId) {
                    return;
                }

                setWorkersError("Could not load workers for this employer.");
            })
            .finally(() => {
                if (workersRequestIdRef.current === workersRequestId) {
                    setLoadingWorkers(false);
                }
            });
    };

    const closeWorkersPopup = () => {
        workersRequestIdRef.current += 1;
        setSelectedEmployer(null);
        setWorkers([]);
        setWorkersError("");
        setLoadingWorkers(false);
    };

    const handleCreateEmployer = (employerData) => {
        setCreatingEmployer(true);

        return createEmployer(employerData)
            .then((response) => {
                if (response.data?.success === false) {
                    return Promise.reject(response);
                }

                return refreshOverview().then(() => {
                    showToast("Employer created successfully.");
                });
            })
            .catch((error) => {
                console.log("CREATE EMPLOYER REQUEST FAILED:", error.response?.data || error.data || error);
                return Promise.reject(error);
            })
            .finally(() => setCreatingEmployer(false));
    };

    const handleRefreshOverview = () => {
        setRefreshingOverview(true);
        setOverviewError("");

        refreshOverview()
            .then(() => {
                showToast("General overview refreshed.");
            })
            .catch(() => {
                setOverviewError("Could not refresh admin overview.");
                showToast("Could not refresh admin overview.", "error");
            })
            .finally(() => setRefreshingOverview(false));
    };

    const handleCopyValue = (value, label = "Value") => {
        if (!value) {
            showToast(`${label} is not available.`, "error");
            return;
        }

        navigator.clipboard.writeText(value.toString())
            .then(() => showToast(`${label} copied.`))
            .catch(() => showToast(`Could not copy ${label.toLowerCase()}.`, "error"));
    };

    const requestDeleteEmployer = (employer) => {
        setEmployerPendingDelete(employer);
    };

    const confirmDeleteEmployer = () => {
        const employerId = getUserId(employerPendingDelete);

        if (!employerId) {
            setOverviewError("Employer id is missing.");
            setEmployerPendingDelete(null);
            return;
        }

        setDeletingEmployerId(employerId);
        setOverviewError("");

        deleteEmployer(employerId)
            .then((response) => {
                if (response.data?.success === false) {
                    setOverviewError("Employer deletion failed.");
                    showToast("Employer deletion failed.", "error");
                    return;
                }

                if (getUserId(selectedEmployer) === employerId) {
                    setSelectedEmployer(null);
                    setWorkers([]);
                    setWorkersError("");
                }

                setEmployerPendingDelete(null);
                return refreshOverview().then(() => {
                    showToast("Employer deleted successfully.");
                });
            })
            .catch(() => {
                setOverviewError("Employer deletion failed.");
                showToast("Employer deletion failed.", "error");
            })
            .finally(() => setDeletingEmployerId(null));
    };

    const confirmLogout = () => {
        logout()
            .finally(() => {
                sessionStorage.removeItem("adminLoggedIn");
                navigate("/");
            });
    };

    const handleLogout = () => {
        setLogoutPending(true);
    };

    return (
        <div className="admin-dashboard-page">
            <header className="admin-header">
                <div>
                    <p>Admin area</p>
                    <h1>Dashboard</h1>
                </div>
                <button className="admin-logout-btn" onClick={handleLogout} type="button">
                    <AdminIcon name="logout" />
                    Logout
                </button>
            </header>

            {overviewError && <div className="admin-error">{overviewError}</div>}

            {toast && (
                <div className={`admin-toast ${toast.type}`} role="status">
                    {toast.message}
                </div>
            )}

            <AdminCards generalInfo={generalInfo} realtimeInfo={realtimeInfo} />

            <main className="admin-dashboard-grid">
                {isCreateEmployerOpen && (
                    <AdminEmployerForm
                        loading={creatingEmployer}
                        onCreateEmployer={handleCreateEmployer}
                        onClose={() => setCreateEmployerOpen(false)}
                    />
                )}

                <section className="admin-panel employers-panel">
                    <div className="admin-section-header">
                        <div>
                            <p>General overview</p>
                            <h2>Employers</h2>
                        </div>
                        <div className="admin-section-actions">
                            <button
                                className="admin-primary-btn"
                                type="button"
                                onClick={() => setCreateEmployerOpen(true)}
                            >
                                <AdminIcon name="add" />
                                Add employer
                            </button>
                            <button
                                className="admin-refresh-btn"
                                type="button"
                                onClick={handleRefreshOverview}
                                disabled={refreshingOverview || loadingOverview}
                            >
                                <AdminIcon name="refresh" />
                                {refreshingOverview ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>
                    </div>
                    <EmployersTable
                        employers={employers}
                        loading={loadingOverview}
                        selectedEmployerId={getUserId(selectedEmployer)}
                        onSelectEmployer={handleSelectEmployer}
                        onDeleteEmployer={requestDeleteEmployer}
                        deletingEmployerId={deletingEmployerId}
                        disabledDeleteEmployerId={loadingWorkers ? getUserId(selectedEmployer) : null}
                        onAddEmployer={() => setCreateEmployerOpen(true)}
                        onCopyValue={handleCopyValue}
                    />
                </section>

                <RealtimePanel
                    realtimeInfo={realtimeInfo}
                    loading={loadingRealtime}
                    lastRefreshed={lastRealtimeRefresh}
                    onRefresh={() => fetchRealtimeInfo(true)}
                />

            </main>

            <WorkersPanel
                key={getUserId(selectedEmployer) || "workers-popup"}
                employer={selectedEmployer}
                workers={workers}
                loading={loadingWorkers}
                error={workersError}
                onCopyValue={handleCopyValue}
                onClose={closeWorkersPopup}
            />

            <ConfirmationPopUp
                isOpen={Boolean(employerPendingDelete)}
                title={`Delete ${getUserDisplayName(employerPendingDelete, "employer")}?`}
                message={`${getUserDisplayName(employerPendingDelete, "This employer")} and all employer-worker relations will be removed. This action cannot be undone.`}
                confirmLabel="Delete employer"
                loading={Boolean(deletingEmployerId)}
                onCancel={() => setEmployerPendingDelete(null)}
                onConfirm={confirmDeleteEmployer}
            />

            <ConfirmationPopUp
                isOpen={isLogoutPending}
                title="Logout from admin?"
                message="You will need to log in again to access the admin dashboard."
                confirmLabel="Logout"
                danger={false}
                onCancel={() => setLogoutPending(false)}
                onConfirm={confirmLogout}
            />
        </div>
    );
}

export default AdminDashboardPage;
