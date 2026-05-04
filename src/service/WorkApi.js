import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:8085",
});

export const getCurrentWorker = (token) => {
    return api.get("/work/status",{
        headers: {Authorization: token},
        }
    );

};

export const enterWork = (data, ) => {
    return api.post("/work/enter", data, {

    });
};
export const exitWork = (data,) => {
    return api.post("/work/exit", data,{
    });
};
export const getHoursReport =(token) => {
    return api.get("/work/list", {
        headers: {Authorization: token},
    });
//     לשנות את השם ל לנכרן כמובן עם רומן getHours
}
