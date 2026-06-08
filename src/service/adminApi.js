import api from "./api";

export const getGeneralInfo = () => {
    return api.get("/admin/general-info");
};

export const getEmployersList = () => {
    return api.get("/admin/employers-list");
};

export const getEmployerWorkers = (employerId) => {
    return api.get("/admin/employer-worker", {
        params: {employerId},
    });
};

export const getRealtimeInfo = () => {
    return api.get("/admin/realtime-info");
};

export const createEmployer = (data) => {
    return api.post("/admin/create-employer", data);
};

export const deleteEmployer = (employerId) => {
    return api.delete("/admin/delete-employer", {
        params: {employerId},
    });
};
