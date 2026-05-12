import API from "./axios";

// REGISTER
export const registerUser = (data) => {
    return API.post("/auth/register", data);
};

// LOGIN
export const loginUser = (data) => {
    return API.post("/auth/login", data);
};

// LOGOUT (optional)
export const logoutUser = () => {
    return API.post("/auth/logout");
};