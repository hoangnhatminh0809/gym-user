import axios from "axios";

// Axios instance
const api = axios.create({
    baseURL: "https://gym-system-taupe.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = (data: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}) => api.post("/user/api/register/", data);

export const login = (data: { username: string; password: string }) =>
    api.post("/user/api/login/", data);

export const refreshToken = (refreshToken: string) =>
    api.post("/user/api/refresh-token/", { refresh_token: refreshToken });

export const logout = () => api.get("/logout/");

export const createCheckoutSession = (amount: number) =>
    api.post("/user/api/create-checkout-session/", { amount });

export default api;
