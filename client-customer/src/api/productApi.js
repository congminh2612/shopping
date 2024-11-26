// src/api/productApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/user/categories';

// Lấy tất cả sản phẩm hoặc theo danh mục cụ thể
export const getProductsByCategory = async (categoryName) => {
  try {
    // Nếu categoryName không có giá trị, lấy tất cả sản phẩm
    let response;
    if (categoryName) {
      response = await axios.get(`${API_URL}`, {
        params: { category: categoryName }
      });
    } else {
      response = await axios.get(`${API_URL}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
