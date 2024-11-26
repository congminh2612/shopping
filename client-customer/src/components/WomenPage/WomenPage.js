// src/components/WomenPage/WomenPage.js
import React, { useEffect, useState } from 'react';
import { getProductsByCategory } from '../../api/productApi';

function WomenPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory('women');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching women products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="products-page">
      <h2>Women Products</h2>
      <ul className="products-list">
        {products.map((product) => (
          <li key={product.id}>
            <div>{product.name}</div>
            <div>Price: {product.price}₫</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WomenPage;
