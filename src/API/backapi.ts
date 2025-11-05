import axios from "axios";

const origin = "http://localhost:5000";
const withSuffix = (path: string) => `${origin}${path}`;
const api = axios.create({
  baseURL: withSuffix("/api"),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
