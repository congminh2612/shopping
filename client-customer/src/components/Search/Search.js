import React, { useState } from 'react';
import axios from 'axios'; // Bạn có thể dùng axios trực tiếp hoặc file searchApi.js đã tạo trước đó.
import './Search.css';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    let apiUrl = 'http://localhost:3000/api/products';

    // Tạo các query params
    const params = [];

    if (searchTerm) {
      params.push(`search=${searchTerm}`);
    }
    
    if (category) {
      params.push(`category=${category}`);
    }

    if (minPrice) {
      params.push(`minPrice=${minPrice}`);
    }

    if (maxPrice) {
      params.push(`maxPrice=${maxPrice}`);
    }

    if (inStock) {
      params.push(`inStock=${inStock}`);
    }

    // Ghép tất cả các query params vào URL
    if (params.length > 0) {
      apiUrl += `?${params.join('&')}`;
    }

    // Gửi yêu cầu với Axios
    axios.get(apiUrl)
      .then(response => {
        setResults(response.data);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        setResults(["Không tìm thấy kết quả nào"]);
      });
  };

  return (
    <div className="search-container">
      {/* Hộp tìm kiếm */}
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Accessories">Accessories</option>
          <option value="Clothes">Clothes</option>
          <option value="Shoes">Shoes</option>
        </select>
        <input
          type="number"
          className="price-input"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="price-input"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In Stock Only
        </label>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {/* Kết quả tìm kiếm */}
      <div className="search-results">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="result-item">
              <h4>{result.name}</h4>
              <p>Giá: {result.price.toLocaleString()}₫</p>
              <p>Danh mục: {result.category}</p>
              <p>Tình trạng: {result.inStock ? 'Còn hàng' : 'Hết hàng'}</p>
            </div>
          ))
        ) : (
          <p>Không tìm thấy kết quả nào</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
