// src/utils/axios.js
import axios from "axios";

const APIW = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://fixonindia-api.onrender.com/api",
  withCredentials: true,
});

APIW.interceptors.request.use((config) => {
  const token = localStorage.getItem("workerToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default APIW;
