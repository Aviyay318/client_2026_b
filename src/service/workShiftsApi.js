import api from "./api";

export const getWorkShiftsForEmployee = () => {
    return api.get("/work-shifts/get-for-employee");
};
