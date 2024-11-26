// src/components/MenPage/MenPage.js
import React, { useEffect, useState } from 'react';
import { getProductsByCategory } from '../../api/productApi';

function MenPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory('men');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching men products:', error);
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
      <h2>Men Products</h2>
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

export default MenPage;
