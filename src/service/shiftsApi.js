import api from "./api";


export const getAllShifts = (data) => {
    return api.get("/shifts/get-all", {
        params: data
    })
};

export const getEmployerSettingsShifts = () => {
    return api.get("/employer-settings/get-shifts");
};
