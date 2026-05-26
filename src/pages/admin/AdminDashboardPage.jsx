import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AdminCards from "../../components/AdminCards.jsx";
import AdminEmployerForm from "../../components/AdminEmployerForm.jsx";
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

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [generalInfo, setGeneralInfo] = useState(emptyGeneralInfo);
    const [realtimeInfo, setRealtimeInfo] = useState(emptyRealtimeInfo);
    const [employers, setEmployers] = useState([]);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [loadingRealtime, setLoadingRealtime] = useState(false);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [creatingEmployer, setCreatingEmployer] = useState(false);
    const [deletingEmployerId, setDeletingEmployerId] = useState(null);
    const [isCreateEmployerOpen, setCreateEmployerOpen] = useState(false);
    const [employerPendingDelete, setEmployerPendingDelete] = useState(null);
    const [overviewError, setOverviewError] = useState("");
    const [workersError, setWorkersError] = useState("");

    const updateOverview = (generalResponse, employersResponse) => {
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
        });
    };

    const refreshOverview = () => {
        return Promise.all([getGeneralInfo(), getEmployersList()])
            .then(([generalResponse, employersResponse]) => {
                return updateOverview(generalResponse, employersResponse);
            });
    };

    const fetchRealtimeInfo = () => {
        setLoadingRealtime(true);

        getRealtimeInfo()
            .then((response) => {
                setRealtimeInfo(normalizeRealtimeInfo(readPayload(response)));
            })
            .catch(() => {
                setRealtimeInfo(emptyRealtimeInfo);
            })
            .finally(() => setLoadingRealtime(false));
    };

    useEffect(() => {
        if (sessionStorage.getItem("adminLoggedIn") !== "true") {
            navigate("/admin/login");
            return;
        }

        Promise.all([getGeneralInfo(), getEmployersList()])
            .then(([generalResponse, employersResponse]) => {
                return updateOverview(generalResponse, employersResponse);
            })
            .catch(() => {
                setOverviewError("Could not load admin overview. Please try again.");
            })
            .finally(() => setLoadingOverview(false));

        const realtimeTimeoutId = setTimeout(fetchRealtimeInfo, 0);

        return () => clearTimeout(realtimeTimeoutId);
    }, [navigate]);

    const handleSelectEmployer = (employer) => {
        const employerId = employer.id ?? employer.employerId ?? employer.userId;

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
                setWorkers(normalizeWorkers(readPayload(response)));
            })
            .catch(() => {
                setWorkersError("Could not load workers for this employer.");
            })
            .finally(() => setLoadingWorkers(false));
    };

    const handleCreateEmployer = (employerData) => {
        setCreatingEmployer(true);

        return createEmployer(employerData)
            .then((response) => {
                if (response.data?.success === false) {
                    return Promise.reject(response);
                }

                return refreshOverview();
            })
            .catch((error) => {
                console.log("CREATE EMPLOYER REQUEST FAILED:", error.response?.data || error.data || error);
                return Promise.reject(error);
            })
            .finally(() => setCreatingEmployer(false));
    };

    const requestDeleteEmployer = (employer) => {
        setEmployerPendingDelete(employer);
    };

    const confirmDeleteEmployer = () => {
        const employerId = employerPendingDelete?.id ?? employerPendingDelete?.employerId ?? employerPendingDelete?.userId;

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
                    return;
                }

                if ((selectedEmployer?.id ?? selectedEmployer?.employerId ?? selectedEmployer?.userId) === employerId) {
                    setSelectedEmployer(null);
                    setWorkers([]);
                    setWorkersError("");
                }

                setEmployerPendingDelete(null);
                return refreshOverview();
            })
            .catch(() => {
                setOverviewError("Employer deletion failed.");
            })
            .finally(() => setDeletingEmployerId(null));
    };

    const handleLogout = () => {
        logout()
            .finally(() => {
                sessionStorage.removeItem("adminLoggedIn");
                navigate("/");
            });
    };

    return (
        <div className="admin-dashboard-page">
            <header className="admin-header">
                <div>
                    <p>Admin area</p>
                    <h1>Dashboard</h1>
                </div>
                <button className="admin-logout-btn" onClick={handleLogout} type="button">
                    Logout
                </button>
            </header>

            {overviewError && <div className="admin-error">{overviewError}</div>}

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
                        <button
                            className="admin-primary-btn"
                            type="button"
                            onClick={() => setCreateEmployerOpen(true)}
                        >
                            Add employer
                        </button>
                    </div>
                    <EmployersTable
                        employers={employers}
                        loading={loadingOverview}
                        selectedEmployerId={selectedEmployer?.id ?? selectedEmployer?.employerId ?? selectedEmployer?.userId}
                        onSelectEmployer={handleSelectEmployer}
                        onDeleteEmployer={requestDeleteEmployer}
                        deletingEmployerId={deletingEmployerId}
                    />
                </section>

                <RealtimePanel
                    realtimeInfo={realtimeInfo}
                    loading={loadingRealtime}
                    onRefresh={fetchRealtimeInfo}
                />

                <WorkersPanel
                    employer={selectedEmployer}
                    workers={workers}
                    loading={loadingWorkers}
                    error={workersError}
                    onClose={() => {
                        setSelectedEmployer(null);
                        setWorkers([]);
                        setWorkersError("");
                    }}
                />
            </main>

            <ConfirmationPopUp
                isOpen={Boolean(employerPendingDelete)}
                title="Delete employer?"
                message="This will remove the employer and all employer-worker relations. This action cannot be undone."
                confirmLabel="Delete employer"
                loading={Boolean(deletingEmployerId)}
                onCancel={() => setEmployerPendingDelete(null)}
                onConfirm={confirmDeleteEmployer}
            />
        </div>
    );
}

export default AdminDashboardPage;
