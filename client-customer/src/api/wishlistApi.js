// src/api/wishlistApi.js
import axios from 'axios';
const token = localStorage.getItem('token');

const API_URL = 'http://localhost:3000/api/wishlist';

// Tạo Wishlist
export const createWishlist = (wishlistData) => {
	return axios.post(`${API_URL}`, wishlistData);
};

// Lấy Wishlist
export const getWishlist = async () => {
	const res = await axios.get(`${API_URL}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};

// Xóa Wishlist theo ID
export const clearWishlistById = (wishlistId) => {
	return axios.delete(`${API_URL}/${wishlistId}`);
};

// Xóa tất cả Wishlist
export const clearAllWishlist = () => {
	return axios.delete(`${API_URL}`);
};
