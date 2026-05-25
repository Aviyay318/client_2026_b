import api from "./api";

export const getAllActiveEmployees = () => {
    return api.get("/crud-employee/get-all-active");
}

export const createEmployee = (data) => {
    return api.post("/crud-employee/create-employee", data);
}

export const deleteEmployee = (data) => {
    return api.post("/crud-employee/delete-employee", data);
}
export const getAllEmployees = () => {
    return api.get("/crud-employee/all-employees");
}

    export const getEmployeeById = (employeeId) => {
        return api.get(`/crud-employee/employee-by-id?employeeId=${employeeId}`);
    }