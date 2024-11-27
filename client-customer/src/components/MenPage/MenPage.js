// src/components/MenPage/MenPage.js
import React from "react";
import ProductList from "../ProductList/ProductList";

const MenPage = () => {
  return (
    <div>
      <h1>Men's Products</h1>
      <ProductList category="men" /> {/* Truyền vào danh mục "men" */}
    </div>
  );
};

export default MenPage;
