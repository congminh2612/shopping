import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faShoppingCart, faUser, faHeart, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // Import AuthContext

function Header() {
  const { isLoggedIn, login, logout } = useContext(AuthContext); // Lấy trạng thái và hàm từ context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Hàm để thay đổi trạng thái mở/đóng của menu
  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  // Hàm để đóng menu khi chọn mục
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Hàm để điều hướng tới trang profile hoặc login tùy thuộc vào trạng thái người dùng
  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // Hàm để đăng xuất người dùng
  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context để cập nhật trạng thái
    navigate("/login");
  };

  // useEffect để lắng nghe sự thay đổi của token trong localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        login(token);
      } else {
        logout();
      }
    };

    // Đăng ký lắng nghe sự kiện thay đổi localStorage
    window.addEventListener("storage", handleStorageChange);

    // Kiểm tra trạng thái khi component được mount
    handleStorageChange();

    // Cleanup event listener khi component bị unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [login, logout]);

  return (
    <>
      {/* Thanh Header */}
      <header className="header-container">
        <div className="header-left">
          <button className="hamburger-button" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <div className="header-logo">
          <Link to="/" className="shop-name">SHOP CLOTHING</Link>
        </div>

        <div className="header-icons">
          <Link to="/search" className="header-icon">
            <FontAwesomeIcon icon={faSearch} />
          </Link>
          <Link to="/wishlist" className="header-icon">
            <FontAwesomeIcon icon={faHeart} />
          </Link>
          <Link to="/cart" className="header-icon">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>

          {/* Biểu tượng User hoặc Logout - tùy thuộc vào trạng thái đăng nhập */}
          <div
            className="header-icon"
            onClick={isLoggedIn ? handleLogout : handleUserIconClick}
            title={isLoggedIn ? "Logout" : "Login/Register"}
          >
            <FontAwesomeIcon
              icon={isLoggedIn ? faSignOutAlt : faUser}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </header>

      {/* Thanh Menu Ngang */}
      <nav className={`horizontal-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/products/all" onClick={closeMenu}>All Products</Link>
          </li>
          <li>
            <Link to="/products/men" onClick={closeMenu}>Men</Link>
          </li>
          <li>
            <Link to="/products/women" onClick={closeMenu}>Women</Link>
          </li>
          <li>
            <Link to="/products/outwear" onClick={closeMenu}>Outwear</Link>
          </li>
          <li>
            <Link to="/products/accessories" onClick={closeMenu}>Accessories</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
