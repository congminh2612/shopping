import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../api/userApi';

function AllProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Gọi API để lấy tất cả sản phẩm
    getAllProducts()
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="all-products-page">
      <h2>All Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-item">
              <h4>{product.name}</h4>
              <p>{product.price.toLocaleString()}₫</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProductsPage;
