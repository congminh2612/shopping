import axios from "axios";

// Axios instance for backend API
const API = axios.create({
  baseURL: "http://localhost:3000/api", // Backend base URL
});

// Attach Authorization token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
