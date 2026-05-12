import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

// =======================
// Attach Access Token
// =======================
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =======================
// Refresh Token Logic
// =======================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
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
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return API(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(
                    "http://localhost:3000/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = res.data.accessToken;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                return API(originalRequest);

            } catch (err) {
                processQueue(err, null);

                localStorage.removeItem("accessToken");

                window.location.href = "/login";

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default API;