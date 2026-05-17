import api from "./api";


export const getAllShifts = (data) => {
    return api.get("/shifts-get-all", {
        params: data
    })
};