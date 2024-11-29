// src/components/ProductDetail/ProductDetail.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import "./ProductDetail.css"; // CSS cho ProductDetail

const ProductDetail = () => {
  const { id } = useParams(); // Lấy product ID từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch product details từ API
    const fetchProduct = async () => {
      try {
        console.log("Fetching product details for ID:", id);
        const { data } = await API.get(`/user/products/${id}`);
        console.log("Product data fetched:", data);
        setProduct(data); // Cập nhật state với dữ liệu sản phẩm
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Có lỗi xảy ra khi lấy thông tin sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>; // Hiển thị loading khi đang fetch dữ liệu
  if (error) return <p>Error: {error}</p>; // Hiển thị lỗi nếu có
  if (!product) return <p>Không tìm thấy sản phẩm</p>; // Trường hợp không có sản phẩm

  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <h2 className="product-detail-title">{product.name}</h2>
        <p className="product-detail-price">{product.price} VND</p>
        <p className="product-detail-description">{product.description}</p>
        <div className="product-sizes">
          <h4>Chọn kích cỡ:</h4>
          {product.sizes?.map((size) => (
            <button key={size} className="size-button">
              {size}
            </button>
          ))}
        </div>
        <div className="product-quantity">
          <label htmlFor="quantity">Số lượng:</label>
          <input type="number" id="quantity" min="1" defaultValue="1" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
