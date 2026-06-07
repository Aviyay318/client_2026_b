import api from "./api";

export const getAllActiveEmployees = () => {
    return api.get("/crud-employee/get-all-active");
}

export const createEmployee = (data) => {
    return api.post("/crud-employee/create-employee", data);
}

export const deleteEmployee = (data) => {
    console.log("DELETE API" ,data)
   return api.delete(`/crud-employee/delete-employee?personalId=${data.personalId}`)
}
export const getAllEmployees = () => {
    return api.get("/crud-employee/all-employees");
}

export const getEmployeeById = (employeeId) => {
    return api.get(`/crud-employee/employee-by-id?employeeId=${employeeId}`);
}

export const getLeftEmployees = (data) => {
    return api.post("/crud-employee/exited-employees", data);
}

export const getAbsentEmployees = (data) => {
    return api.post("/crud-employee/absenced-employees", data);

}

export const getEmployerShifts = () => {
    return api.get("/employer-settings/get-shifts");
}

export const setShifts = (data) => {
    return api.post("/employer-settings/set-shifts", data);
}

export const saveShifts = setShifts;

export const updateShifts = (data) => {
    return api.post("/employer-settings/update-shift", data);
}

export const deleteShift = (id) => {
    return api.delete(`/employer-settings/delete-shift/${id}`);
}
export const postShifts = () => {
    return api.post("/employer-settings/post-shifts");
}











export const getEmployerApplications = () => {
    return api.get("/applications/get-all");
}

export const answerEmployerApplication = (applicationId, accepted) => {
    return api.post("/applications/answer", {
        applicationId,
        accept: accepted,
    });
}
