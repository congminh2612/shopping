// src/api/searchApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/products';

export const getAllProducts = () => {
  return axios.get(API_BASE_URL);
};

export const searchProducts = (params) => {
  let apiUrl = `${API_BASE_URL}`;

  // Tạo query params từ object params
  if (params && Object.keys(params).length > 0) {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    apiUrl += `?${query}`;
  }

  return axios.get(apiUrl);
};


