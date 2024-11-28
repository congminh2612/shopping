import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/Homepage/Homepage"; // Trang chủ
import ProductList from "./components/ProductList/ProductList";
import CartPage from "./components/Cart/Cart";
import SearchPage from "./components/Search/Search";
import LoginPage from "./components/Login/Login"; // Đăng nhập
import Register from "./components/Register/Register"; // Đăng ký
import ProductDetail from "./components/ProductDetail/ProductDetail";
import WishlistPage from "./components/Wishlist/Wishlist";
import RequestPasswordReset from "./components/RequestPasswordReset/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Verify from "./components/Verify/Verify";
import Profile from "./components/Profile/Profile"; // Thêm trang Profile
import "./App.css";

function App() {
  // Trạng thái người dùng
  const [user, setUser] = useState(null);

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <Header user={user} />

        {/* Nội dung chính */}
        <main className="main-content">
          <Routes>
            {/* Trang chủ */}
            <Route path="/" element={<HomePage />} />

            {/* Các danh mục sản phẩm */}
            <Route path="/products/all" element={<ProductList category="all" />} />
            <Route path="/products/men" element={<ProductList category="men" />} />
            <Route path="/products/women" element={<ProductList category="women" />} />
            <Route path="/products/outwear" element={<ProductList category="outwear" />} />
            <Route path="/products/accessories" element={<ProductList category="accessories" />} />

            {/* Chi tiết sản phẩm */}
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Trang giỏ hàng */}
            <Route path="/cart" element={<CartPage />} />

            {/* Wishlist */}
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Tìm kiếm */}
            <Route path="/search" element={<SearchPage />} />

            {/* Đăng nhập và Đăng ký */}
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<Register />} />

            {/* Khôi phục mật khẩu */}
            <Route path="/request-password-reset" element={<RequestPasswordReset />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Xác minh tài khoản */}
            <Route path="/verify" element={<Verify />} />

            {/* Trang Profile */}
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />

            {/* Redirect không tìm thấy */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
