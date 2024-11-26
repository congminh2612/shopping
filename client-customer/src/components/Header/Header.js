import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faShoppingCart, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hàm để thay đổi trạng thái mở/đóng của menu
  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
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
          <Link to="/login" className="header-icon">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
      </header>

      {/* Thanh Menu Ngang */}
      <div className={`horizontal-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/products/all" onClick={() => setIsMenuOpen(false)}>All Products</Link></li>
          <li><Link to="/products/men" onClick={() => setIsMenuOpen(false)}>Men</Link></li>
          <li><Link to="/products/women" onClick={() => setIsMenuOpen(false)}>Women</Link></li>
          <li><Link to="/products/outwear" onClick={() => setIsMenuOpen(false)}>Outwear</Link></li>
          <li><Link to="/products/accessories" onClick={() => setIsMenuOpen(false)}>Accessories</Link></li>
        </ul>
      </div>
    </>
  );
}

export default Header;
