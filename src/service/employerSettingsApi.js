import api from "./api";

export const getEmployerSettings = () => {
    return api.get("/employer-settings/get-settings");
};

export const setEmployerSettings = (data) => {
    return api.post("/employer-settings/set-settings", data);
};