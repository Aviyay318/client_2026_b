import api from "./api";

export const getEmployerSettings = () => {
    return api.get("/employee-constraints/get-settings");
};

export const getPublishedShifts = () => {
    return api.get("/employee-constraints/get-published-shifts");
};

export const saveEmployeeConstraints = (constraints) => {
    return api.post("/employee-constraints/save-constraints", constraints);
};
