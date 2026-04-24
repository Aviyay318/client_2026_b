import axios from "axios";

const api = axios.create({
    baseURL: 'https://localhost:8085',
});

export const employeeLogin = (data) => {
    api.post("/auth/employeeLogin", {data});
}







