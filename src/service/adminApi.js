import api from "./api";

export const getGeneralInfo = () => {
    return api.get("/admin/general-info");
};

export const getEmployersList = () => {
    return api.get("/admin/employers-list");
};

export const getEmployerWorkers = (employerId) => {
    return api.get(`/admin/employer-workers/${employerId}`);
};

export const getRealtimeInfo = () => {
    return api.get("/admin/realtime-info");
};
