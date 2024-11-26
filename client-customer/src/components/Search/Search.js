import React, { useState, useEffect } from "react";
import API from "../../api/api"; // Axios instance
import "./Search.css";

function Search() {
  const [searchIerm, setSearchIerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [results, setResults] = useState([]);

  // Hàm xử lý tìm kiếm
  const handleSearch = async () => {
    try {
      const params = {};
      if (searchIerm) params.search = searchIerm;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (inStock) params.inStock = true;

      const response = await API.get("/user/products", { params });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]); // Trả về mảng rỗng nếu có lỗi
    }
  };

  // Lắng nghe thay đổi từ các input và tự động gọi handleSearch
  useEffect(() => {
    handleSearch();
  }, [searchIerm, category, minPrice, maxPrice, inStock]);

  return (
    <div className="search-container">
      <div className="search-box">
        {/* Input tìm kiếm */}
        <input
          type="text"
          className="search-input"
          placeholder="Search for products..."
          value={searchIerm}
          onChange={(e) => setSearchIerm(e.target.value)}
        />

        {/* Dropdown chọn danh mục */}
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

        {/* Input giá */}
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

        {/* Checkbox hàng tồn kho */}
        <label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In Stock Only
        </label>
      </div>

      {/* Hiển thị kết quả */}
      <div className="search-results">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="result-item">
              <h4>{result.name}</h4>
              <p>Price: {result.price.toLocaleString()}₫</p>
              <p>Category: {result.category}</p>
              <p>Status: {result.inStock ? "In Stock" : "Out of Stock"}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}

export default Search;
