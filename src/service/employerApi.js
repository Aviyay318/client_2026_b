import api from "./api";

export const getAllActiveEmployees = () => {
    return api.get("/crud-employee/get-all-active");
}

export const createEmployee = (data) => {
    return api.post("/crud-employee/create-employee", data);
}

export const deleteEmployee = (data) => {
   return api.delete(`/crud-employee/delete-employee?employeeId=${data.employeeId}`)
}
export const getAllEmployees = () => {
    return api.get("/crud-employee/all-employees");
}

    export const getEmployeeById = (employeeId) => {
        return api.get(`/crud-employee/employee-by-id?employeeId=${employeeId}`);
    }

    export const leftEmployees = (data) => {
    return api.post("/crud-employee/exited-employees", data);
}

export const absentEmployees = (data) => {
    return api.post("/crud-employee/ansenced-employees", data);
}