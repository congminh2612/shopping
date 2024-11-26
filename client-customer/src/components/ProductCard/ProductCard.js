import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} />
        <div className="product-details">
          <h4>{product.name}</h4>
          <p>{product.price.toLocaleString()}₫</p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
