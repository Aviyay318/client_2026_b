import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AdminCards from "../../components/AdminCards.jsx";
import EmployersTable from "../../components/EmployersTable.jsx";
import RealtimePanel from "../../components/RealtimePanel.jsx";
import WorkersPanel from "../../components/WorkersPanel.jsx";
import {getEmployerWorkers, getEmployersList, getGeneralInfo, getRealtimeInfo} from "../../service/adminApi.js";
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

const normalizeGeneralInfo = (payload) => ({
    employersCount: payload?.employersCount ?? payload?.totalEmployers ?? payload?.employerCount ?? 0,
    workersCount: payload?.workersCount ?? payload?.totalWorkers ?? payload?.employeeCount ?? 0,
});

const normalizeEmployers = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.employers || payload?.employersList || payload?.items || [];
};

const normalizeWorkers = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.workers || payload?.employees || payload?.items || [];
};

const normalizeRealtimeInfo = (payload) => ({
    connectedEmployers: payload?.connectedEmployers ?? payload?.onlineEmployers ?? 0,
    connectedWorkers: payload?.connectedWorkers ?? payload?.onlineWorkers ?? 0,
    connectedUsers: payload?.connectedUsers || payload?.users || [],
});

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
    const [overviewError, setOverviewError] = useState("");
    const [workersError, setWorkersError] = useState("");

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
                setGeneralInfo(normalizeGeneralInfo(readPayload(generalResponse)));
                setEmployers(normalizeEmployers(readPayload(employersResponse)));
            })
            .catch(() => {
                setOverviewError("Could not load admin overview. Please try again.");
            })
            .finally(() => setLoadingOverview(false));

        const realtimeTimeoutId = setTimeout(fetchRealtimeInfo, 0);
        const intervalId = setInterval(fetchRealtimeInfo, 5000);

        return () => {
            clearTimeout(realtimeTimeoutId);
            clearInterval(intervalId);
        };
    }, [navigate]);

    const handleSelectEmployer = (employer) => {
        const employerId = employer.id ?? employer.employerId;

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
                <section className="admin-panel employers-panel">
                    <div className="admin-section-header">
                        <div>
                            <p>General overview</p>
                            <h2>Employers</h2>
                        </div>
                    </div>
                    <EmployersTable
                        employers={employers}
                        loading={loadingOverview}
                        selectedEmployerId={selectedEmployer?.id ?? selectedEmployer?.employerId}
                        onSelectEmployer={handleSelectEmployer}
                    />
                </section>

                <RealtimePanel realtimeInfo={realtimeInfo} loading={loadingRealtime} />

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
        </div>
    );
}

export default AdminDashboardPage;
