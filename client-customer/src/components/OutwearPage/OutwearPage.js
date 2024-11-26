// src/components/OutwearPage/OutwearPage.js
import React, { useEffect, useState } from 'react';
import { getProductsByCategory } from '../../api/productApi';

function OutwearPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory('outwear');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching outwear products:', error);
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
      <h2>Outwear Products</h2>
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

export default OutwearPage;
