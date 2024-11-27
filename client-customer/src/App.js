import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './components/Homepage/Homepage';
import ProductPage from './components/ProductPage/ProductPage';
import CartPage from './components/Cart/Cart';
import SearchPage from './components/Search/Search';
import LoginPage from './components/Login/Login';
import Register from './components/Register/Register';
import ProductDetail from './components/ProductDetail/ProductDetail';
import WishlistPage from './components/Wishlist/Wishlist';
import RequestPasswordReset from './components/RequestPasswordReset/RequestPasswordReset';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Verify from './components/Verify/Verify';  // Import Verify
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <Header />

        {/* Placeholder để tạo khoảng trống cho header */}
        <div className="header-placeholder"></div>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/all" element={<ProductPage category="all" />} />
            <Route path="/products/men" element={<ProductPage category="men" />} />
            <Route path="/products/women" element={<ProductPage category="women" />} />
            <Route path="/products/outwear" element={<ProductPage category="outwear" />} />
            <Route path="/products/accessories" element={<ProductPage category="accessories" />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/request-password-reset" element={<RequestPasswordReset />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify" element={<Verify />} /> {/* Route Verify */}
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
