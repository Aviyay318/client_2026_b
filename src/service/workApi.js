import api from "./api";



export const getCurrentWorker = () => {
    return api.get("/work/status",{
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
export const getHoursReport =() => {
    return api.get("/work/list", {
    });
//     לשנות את השם ל לנכרן כמובן עם רומן getHours
}
