import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

// =======================
// Attach Access Token
// =======================
API.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

// =======================
// Refresh Logic
// =======================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });

    failedQueue = [];
};

// =======================
// Response Interceptor
// =======================
API.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            if (isRefreshing) {
                return new Promise(
                    (resolve, reject) => {
                        failedQueue.push({
                            resolve,
                            reject,
                        });
                    }
                ).then((token) => {
                    originalRequest.headers.Authorization =
                        `Bearer ${token}`;
                    return API(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {

                const res = await API.post(
                    "/auth/refresh",
                    {},
                );

                const newToken =
                    res.data.accessToken;

                localStorage.setItem(
                    "accessToken",
                    newToken
                );

                API.defaults.headers.common.Authorization =
                    `Bearer ${newToken}`;

                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                processQueue(null, newToken);

                window.dispatchEvent(
                    new Event("token-refresh")
                );

                return API(originalRequest);

            } catch (err) {

                processQueue(err, null);

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem("user");

                window.location.assign("/login");

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default API;