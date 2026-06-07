import api from "./api";
import {getEmployerSettingsShifts} from "./shiftsApi.js";

export const getEmployerSettings = () => {
    return api.get("/employer-settings/get-settings");
};

export const getPublishedShifts = () => {
    return getEmployerSettingsShifts();
};

export const saveEmployeeConstraints = (constraints) => {
    return api.post("/employee-constraints/save-constraints", constraints);
};
