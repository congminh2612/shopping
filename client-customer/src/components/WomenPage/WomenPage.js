// src/components/WomenPage/WomenPage.js
import React from "react";
import ProductList from "../ProductList/ProductList";

const WomenPage = () => {
  return (
    <div>
      <h1>Women's Products</h1>
      <ProductList category="women" /> {/* Truyền vào danh mục "women" */}
    </div>
  );
};

export default WomenPage;
