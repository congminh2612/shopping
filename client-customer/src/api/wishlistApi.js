// src/api/wishlistApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/wishlist';

// Tạo Wishlist
export const createWishlist = (wishlistData) => {
  return axios.post(`${API_URL}`, wishlistData);
};

// Lấy Wishlist
export const getWishlist = () => {
  return axios.get(`${API_URL}`);
};

// Xóa Wishlist theo ID
export const clearWishlistById = (wishlistId) => {
  return axios.delete(`${API_URL}/${wishlistId}`);
};

// Xóa tất cả Wishlist
export const clearAllWishlist = () => {
  return axios.delete(`${API_URL}`);
};
