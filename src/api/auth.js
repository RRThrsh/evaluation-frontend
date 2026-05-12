import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/auth",
    withCredentials: true
});

export const registerUser = async (data) => {
    return API.post("/register", data);
};

export const loginUser = async (data) => {
    return API.post("/login", data);
};