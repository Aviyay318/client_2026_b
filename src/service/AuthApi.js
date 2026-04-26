import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8085",
});

export const loginEmployee = (data) => {
    return api.post("/auth/loginEmployee", data);
};

export const loginEmployer = (data) => {
    return api.post("/auth/loginEmployer", data);
};