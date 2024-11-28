import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faShoppingCart, faUser, faHeart, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem có dữ liệu người dùng trong localStorage hay không
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Hàm để thay đổi trạng thái mở/đóng của menu
  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  // Hàm để đóng menu khi chọn mục
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Hàm để đăng xuất người dùng
  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage và cập nhật trạng thái
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/");
  };

  // Hàm để điều hướng tới trang profile hoặc login tùy thuộc vào trạng thái người dùng
  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

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
          
          {/* Biểu tượng User - Điều hướng đến Profile hoặc Login */}
          <div className="header-icon" onClick={handleUserIconClick}>
            <FontAwesomeIcon icon={faUser} />
          </div>

          {/* Biểu tượng Logout - Chỉ hiển thị khi người dùng đã đăng nhập */}
          {user && (
            <div className="header-icon" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
          )}
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
