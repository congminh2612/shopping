import React, { useEffect, useState } from "react";
import API from "../../api/api"; // Đảm bảo đường dẫn tới file API

const ProductList = ({ category = "all" }) => {
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
  const [error, setError] = useState(null); // State để theo dõi lỗi

  useEffect(() => {
    // Kiểm tra giá trị của category
    console.log("Category:", category);

    if (!category) {
      setError("Category không xác định.");
      setLoading(false);
      return;
    }

    // Fetch products từ API
    const fetchProducts = async () => {
      try {
        const { data } = await API.get(`/user/products?category=${category}`);
        setProducts(data); // Cập nhật state với dữ liệu sản phẩm
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]); // useEffect sẽ chạy khi mount hoặc khi category thay đổi

  if (loading) return <p>Loading...</p>; // Hiển thị loading khi đang fetch dữ liệu
  if (error) return <p>Error: {error}</p>; // Hiển thị lỗi nếu có

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <ul>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3> {/* Hiển thị tên sản phẩm */}
              <p>Giá: {product.price} VND</p> {/* Hiển thị giá */}
              <p>Mô tả: {product.description}</p> {/* Hiển thị mô tả */}
            </li>
          ))
        ) : (
          <p>Không có sản phẩm nào</p> // Trường hợp không có sản phẩm
        )}
      </ul>
    </div>
  );
};

export default ProductList;
