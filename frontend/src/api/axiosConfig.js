import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

// Thêm token nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
    return Promise.reject(err);
  }
);

export default api;
