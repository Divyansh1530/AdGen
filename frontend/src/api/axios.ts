import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: ((import.meta.env["VITE_API_URL"] as string) || "http://localhost:5000").replace(
    /\/$/,
    "",
  ),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    let message = "An unexpected error occurred. Please try again.";

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      if (error.message.toLowerCase().includes("network error") || error.code === "ERR_NETWORK") {
        message = "Cannot connect to server. Please verify the backend is running.";
      } else {
        message = error.message;
      }
    }

    const enhancedError = new Error(message);
    (enhancedError as any).status = error.response?.status || 0;
    (enhancedError as any).originalError = error;

    // Handle 401 Unauthorized with silent token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url || "";
      const isAuthEndpoint =
        url.includes("/api/v1/auth/login") ||
        url.includes("/api/v1/auth/register") ||
        url.includes("/api/v1/auth/refresh");

      if (isAuthEndpoint) {
        return Promise.reject(enhancedError);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api
          .post("/api/v1/auth/refresh")
          .then(() => {
            processQueue(null);
            resolve(api(originalRequest));
          })
          .catch((refreshErr) => {
            processQueue(refreshErr);
            reject(enhancedError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(enhancedError);
  },
);

export default api;
