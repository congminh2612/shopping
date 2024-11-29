import React, { createContext, useState, useEffect } from 'react';

// Tạo Context
export const AuthContext = createContext();

// Tạo Provider cho AuthContext
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập từ localStorage khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Hàm đăng nhập, cập nhật trạng thái và lưu token vào localStorage
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  // Hàm đăng xuất, cập nhật trạng thái và xóa token khỏi localStorage
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // Giá trị được cung cấp cho toàn bộ ứng dụng
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
