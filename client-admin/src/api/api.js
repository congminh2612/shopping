import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Attach Authorization token to all requests
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//     console.log("Token attached to request:", req.headers.Authorization);
//   } else {
//     console.error("No token found in localStorage");
//   }
//   return req;
// });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  // Bỏ qua Authorization header cho các endpoint /auth
  if (!req.url.includes("/auth")) {
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached:", req.headers.Authorization);
    } else {
      console.error("No token found in localStorage");
    }
  }

  return req;
});

export default API;
