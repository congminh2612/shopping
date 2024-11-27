import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isTokenValid = token && token.length > 0; // Kiểm tra token hợp lệ
  return isTokenValid ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
