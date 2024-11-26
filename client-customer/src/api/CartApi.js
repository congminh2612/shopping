// src/api/CartApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/cart';

// Hàm lấy tất cả sản phẩm trong giỏ hàng
export const getAllCartItems = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = async (itemId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${itemId}`);
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Hàm tạo giỏ hàng mới
export const createCart = async (cartData) => {
  try {
    const response = await axios.post(API_BASE_URL, cartData);
    return response.data;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};
