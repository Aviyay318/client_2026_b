import axios from "axios";
import { refreshToken } from "./authApi";

const api = axios.create({
    baseURL: "http://localhost:8085",
    withCredentials: true,
});


api.interceptors.response.use(

    async (response) => {

        if (response.data?.errorCode === 2000 && !response.config._retry){
            response.config._retry = true;

            const refreshResponse =
                await refreshToken();

            if (!refreshResponse.data?.success) {
                window.location.href = "/";
                return Promise.reject("refresh failed");
            }

            return api(response.config);
        }

        return response;
    },

    (err) => {

        return Promise.reject(err);
    }
);

export default api;