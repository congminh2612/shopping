import React, { useEffect, useState } from 'react';
import { getProductsByCategory } from '../../api/productApi'; // API để lấy sản phẩm theo category
import ProductCard from '../ProductCard/ProductCard'; // Giả sử bạn có một component ProductCard để hiển thị sản phẩm
import './ProductPage.css';

function ProductPage({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(category)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="product-page">
      <h2>{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-list">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
