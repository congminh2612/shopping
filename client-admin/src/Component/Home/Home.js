import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBoxOpen,
  faList,
  faUsers,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../api/api";
import "./Home.css";

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    processingOrders: 0,
  });
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log("Đăng xuất thành công");
    navigate("/admin/login");
  };

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes, usersRes, ordersRes] =
          await Promise.all([
            API.get("/admin/products"),
            API.get("/admin/categories"),
            API.get("/admin/users"),
            API.get("/cart"),
          ]);

        setDashboardData({
          totalProducts: productsRes.data.length,
          totalCategories: categoriesRes.data.length,
          totalUsers: usersRes.data.length,
          processingOrders: ordersRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">Trang chủ admin</div>
        <div className="left-section">
          {!isMenuOpen && (
            <div className="menu-button" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} /> Menu
            </div>
          )}
          {isMenuOpen && (
            <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
              <button className="close-button" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} />
              </button>
              <ul className="menu-list">
                <li onClick={() => navigate("/admin/home")}>Dashboard</li>
                <li onClick={() => navigate("/admin/products")}>
                  Quản lý sản phẩm
                </li>
                <li onClick={() => navigate("/admin/categories")}>
                  Quản lý mục lục
                </li>
                <li onClick={() => navigate("/admin/users")}>
                  Quản lý người dùng
                </li>
                <li onClick={() => navigate("/admin/orders")}>
                  Quản lý đơn hàng
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="user-menu">
          <div
            className="user-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
              alt="User Icon"
              className="user-avatar"
            />
          </div>
          {dropdownOpen && (
            <div className="user-dropdown">
              <button
                className="dropdown-button"
                onClick={() => navigate("/admin/users")}
              >
                Chỉnh sửa người dùng
              </button>
              <button className="dropdown-button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Dashboard Section */}
      <main className="dashboard">
        <h1>Dashboard</h1>
        <div className="dashboard-widgets">
          <div className="widget">
            <FontAwesomeIcon icon={faBoxOpen} className="widget-icon" />
            <h3>Tổng sản phẩm</h3>
            <p>{dashboardData.totalProducts}</p>
          </div>
          <div className="widget">
            <FontAwesomeIcon icon={faList} className="widget-icon" />
            <h3>Tổng danh mục</h3>
            <p>{dashboardData.totalCategories}</p>
          </div>
          <div className="widget">
            <FontAwesomeIcon icon={faUsers} className="widget-icon" />
            <h3>Tổng người dùng</h3>
            <p>{dashboardData.totalUsers}</p>
          </div>
          <div className="widget">
            <FontAwesomeIcon icon={faShoppingCart} className="widget-icon" />
            <h3>Đơn hàng đang xử lý</h3>
            <p>{dashboardData.processingOrders}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
