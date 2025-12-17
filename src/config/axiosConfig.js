// src/utils/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://fixonindia-api.onrender.com/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("utoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;












// // src/utils/axios.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:3001/api",
//   withCredentials: true,
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("utoken");
//   const workerToken = localStorage.getItem("workerToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }  else if (userToken) {
//       config.headers.Authorization = `Bearer ${userToken}`;}
//   return config;
// });

// export default API;



















// const apiUrl = import.meta.env.VITE_API_URL;
// import axios from "axios";

// const API = axios.create({
//   baseURL: apiUrl || "https://fixonindia-backend-1.onrender.com/api",
//   // withCredentials: true, // safe to keep
// });

// // Interceptor to automatically attach JWT for worker or user
// API.interceptors.request.use(
//   (config) => {
//     const workerToken = localStorage.getItem("workerToken");
//     const userToken = localStorage.getItem("utoken");

//     if (workerToken) {
//       config.headers.Authorization = `Bearer ${workerToken}`;
//     } else if (userToken) {
//       config.headers.Authorization = `Bearer ${userToken}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default API;



















// const apiUrl = import.meta.env.VITE_API_URL;
// import axios from "axios";

// const API = axios.create({
//   baseURL: apiUrl || "https://fixonindia-backend-1.onrender.com/api",
//   withCredentials: true, // still needed if you later use cookies
// });

// // Interceptor to automatically attach JWT for worker or user
// API.interceptors.request.use(
//   (config) => {
//     // 1️⃣ Check worker token first
//     const workerToken = localStorage.getItem("workerToken");
//     if (workerToken) {
//       config.headers.Authorization = `Bearer ${workerToken}`;
//       return config;
//     }

//     // 2️⃣ Check user token (utoken)
//     const userToken = localStorage.getItem("utoken");
//     if (userToken) {
//       config.headers.Authorization = `Bearer ${userToken}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default API;
























// const apiUrl = import.meta.env.VITE_API_URL;
// import axios from "axios";

// const API = axios.create({
//   baseURL:apiUrl || "https://fixonindia-backend-1.onrender.com/api", 
//   // baseURL:apiUrl || "http://localhost:3001/api", 
//   withCredentials: true, 
  
//   // headers: { "Content-Type": "multipart/form-data" }
// });


// API.interceptors.request.use(
//   (config) => {
//     const workerToken = localStorage.getItem("workerToken");
//     if (workerToken) {
//       config.headers.Authorization = `Bearer ${workerToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default API;