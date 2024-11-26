import axios from 'axios';

const API_URL = 'http://localhost:3000/api/user';

// Lấy thông tin người dùng
export const getUserInfo = () => {
  return axios.get(`${API_URL}/info`);
};

// Cập nhật tên người dùng
export const updateUserName = (name) => {
  return axios.put(`${API_URL}/name`, { name });
};

// Xóa tên người dùng (ví dụ: mục đích nào đó)
export const deleteUserName = () => {
  return axios.delete(`${API_URL}/name`);
};

// Lấy tất cả danh mục
export const getAllCategories = () => {
  return axios.get(`${API_URL}/category`);
};

// Lấy tất cả sản phẩm
export const getAllProducts = () => {
  return axios.get(`${API_URL}/products`);
};
