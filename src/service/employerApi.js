import api from "./api";

export const getAllActiveEmployees = () => {
    return api.get("/crud-employee/get-all-active");
}

export const createEmployee = (data) => {
    return api.post("/crud-employee/creat-employee", data);
}

export const deleteEmployee = (data) => {
    return api.post("/crud-employee/delete/employee", data);
}

