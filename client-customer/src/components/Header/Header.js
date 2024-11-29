// src/components/Header/Header.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faShoppingCart, faUser, faHeart, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prevShowSearchBar) => !prevShowSearchBar);
  };

  const handleSearchRedirect = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <>
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
          <div className="header-icon" onClick={toggleSearchBar}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <Link to="/wishlist" className="header-icon">
            <FontAwesomeIcon icon={faHeart} />
          </Link>
          <Link to="/cart" className="header-icon">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
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

      {showSearchBar && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-submit" onClick={handleSearchRedirect}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      )}

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
