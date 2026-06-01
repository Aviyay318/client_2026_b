import api from "./api.js";

export const reportAbsence= (data)=>{
    return api.post("/applications/report",data)
}