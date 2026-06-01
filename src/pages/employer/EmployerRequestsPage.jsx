import {useEffect, useMemo, useState} from "react";
import NavbarEmployer from "../../Navbar/navbar-employer/NavbarEmployer.jsx";
import {
    answerEmployerApplication,
    getEmployeeById,
    getEmployerApplications,
} from "../../service/employerApi.js";
import "./EmployerDashboard.css";

const readPayload = (response) => {
    return response.data?.data || response.data?.result || response.data;
};

const normalizeApplications = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.applications || payload?.requests || payload?.items || [];
};

const normalizeEmployee = (payload) => {
    return payload?.employee || payload?.worker || payload?.user || payload;
};

const getApplicationId = (application) => {
    return application.id ?? application.applicationId ?? application.requestId;
};

const getEmployeeName = (application) => {
    const employee = application.employeeDetails || application.employee || application.worker || {};
    const fullName = `${application.firstName || employee.firstName || ""} ${application.lastName || employee.lastName || ""}`.trim();

    return application.employeeName ||
        application.workerName ||
        employee.name ||
        employee.fullName ||
        fullName ||
        application.employee_id ||
        application.employeeId ||
        "Employee";
};

const getEmployeeIdValue = (application) => {
    return application.employee_id ??
        application.employeeId ??
        application.employee?.id ??
        application.employee?.personalId ??
        application.employeeDetails?.id ??
        application.employeeDetails?.personalId;
};

const getEmployeeId = (application) => {
    return getEmployeeIdValue(application) ?? "Not available";
};

const getEmployeePhone = (application) => {
    const employee = application.employeeDetails || application.employee || application.worker || {};
    return application.phone || employee.phone || employee.phoneNumber || "";
};

const getEmployeeEmail = (application) => {
    const employee = application.employeeDetails || application.employee || application.worker || {};
    return application.email || employee.email || "";
};

const enrichApplicationsWithEmployees = (nextApplications) => {
    return Promise.all(nextApplications.map((application) => {
        const employeeId = getEmployeeIdValue(application);

        if (!employeeId) {
            return Promise.resolve(application);
        }

        return getEmployeeById(employeeId)
            .then((response) => ({
                ...application,
                employeeDetails: normalizeEmployee(readPayload(response)),
            }))
            .catch(() => application);
    }));
};

const formatDate = (value) => {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-GB");
};

function EmployerRequestsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [answeringApplicationId, setAnsweringApplicationId] = useState(null);
    const [toast, setToast] = useState("");

    const waitingApplications = useMemo(() => {
        return applications.filter((application) => {
            const status = application.status?.toString().toUpperCase();
            return !status || status === "WAITING";
        });
    }, [applications]);

    const loadApplications = (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
            setError("");
        }

        getEmployerApplications()
            .then((response) => {
                return enrichApplicationsWithEmployees(normalizeApplications(readPayload(response)));
            })
            .then((nextApplications) => {
                setApplications(nextApplications);
            })
            .catch((requestError) => {
                console.log("Error loading employer applications", requestError.response?.data || requestError);
                setError("Could not load employee requests. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getEmployerApplications()
            .then((response) => {
                return enrichApplicationsWithEmployees(normalizeApplications(readPayload(response)));
            })
            .then((nextApplications) => {
                setApplications(nextApplications);
            })
            .catch((requestError) => {
                console.log("Error loading employer applications", requestError.response?.data || requestError);
                setError("Could not load employee requests. Please try again.");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!toast) {
            return undefined;
        }

        const timeoutId = setTimeout(() => setToast(""), 3000);

        return () => clearTimeout(timeoutId);
    }, [toast]);

    const handleAnswerApplication = (application, accepted) => {
        const applicationId = getApplicationId(application);

        if (!applicationId) {
            setError("Request id is missing.");
            return;
        }

        setAnsweringApplicationId(applicationId);
        setError("");

        answerEmployerApplication(applicationId, accepted)
            .then((response) => {
                if (response.data?.success === false) {
                    return Promise.reject(response);
                }

                setApplications((currentApplications) => (
                    currentApplications.filter((currentApplication) => (
                        getApplicationId(currentApplication) !== applicationId
                    ))
                ));
                setToast(accepted ? "Request accepted." : "Request denied.");
            })
            .catch((requestError) => {
                console.log("Error answering employer application", requestError.response?.data || requestError);
                setError("Could not update this request. Please try again.");
            })
            .finally(() => setAnsweringApplicationId(null));
    };

    return (
        <div className="manager-dashboard-shell employer-requests-page">
            <NavbarEmployer active="Requests" />

            <div className="manager-dashboard-content">
                <header className="manager-topbar">
                    <div>
                        <span className="manager-eyebrow">WorkSync Requests</span>
                        <h1>Employee Requests</h1>
                        <p>Review absence reports from employees and approve or deny each request.</p>
                    </div>

                    <button className="manager-secondary-btn" type="button" onClick={loadApplications} disabled={loading}>
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </header>

                {toast && <div className="manager-toast" role="status">{toast}</div>}
                {error && <div className="manager-error">{error}</div>}

                <section className="manager-glass-panel employer-requests-panel">
                    <div className="manager-section-header">
                        <div>
                            <span className="manager-eyebrow">Pending applications</span>
                            <h2>Waiting Requests</h2>
                        </div>
                        <div className="requests-count">{waitingApplications.length} waiting</div>
                    </div>

                    {loading && <div className="manager-state">Loading employee requests...</div>}

                    {!loading && !waitingApplications.length && (
                        <div className="manager-state">No waiting requests right now.</div>
                    )}

                    {!loading && Boolean(waitingApplications.length) && (
                        <div className="requests-list">
                            {waitingApplications.map((application, index) => {
                                const applicationId = getApplicationId(application);
                                const isAnswering = answeringApplicationId === applicationId;

                                return (
                                    <article className="request-row" key={applicationId || index}>
                                        <div className="request-person">
                                            <strong>{getEmployeeName(application)}</strong>
                                            <div className="request-employee-meta">
                                                <span>ID {getEmployeeId(application)}</span>
                                                {getEmployeePhone(application) && <span>{getEmployeePhone(application)}</span>}
                                                {getEmployeeEmail(application) && <span>{getEmployeeEmail(application)}</span>}
                                            </div>
                                        </div>

                                        <div className="request-detail">
                                            <span>Date</span>
                                            <strong>{formatDate(application.date)}</strong>
                                        </div>

                                        <div className="request-reason">
                                            <span>Reason</span>
                                            <strong>{application.reason || "No reason provided"}</strong>
                                        </div>

                                        <div className="request-actions">
                                            <button
                                                className="request-accept-btn"
                                                type="button"
                                                disabled={isAnswering}
                                                onClick={() => handleAnswerApplication(application, true)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="request-deny-btn"
                                                type="button"
                                                disabled={isAnswering}
                                                onClick={() => handleAnswerApplication(application, false)}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default EmployerRequestsPage;
