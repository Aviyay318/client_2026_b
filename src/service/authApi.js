import api from "./api";


export const loginEmployee = (data) => {
    return api.post("/auth/loginEmployee", data);
};

export const loginEmployer = (data) => {
    return api.post("/auth/loginEmployer", data);
};
export const logout = () => {
    return api.post("/auth/logout");
}
export const refreshToken =()=>{
    return api.post("/auth/refresh");
}