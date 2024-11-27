// src/components/OutwearPage/OutwearPage.js
import React from "react";
import ProductList from "../ProductList/ProductList";

const OutwearPage = () => {
  return (
    <div>
      <h1>Outwear</h1>
      <ProductList category="outwear" /> {/* Truyền vào danh mục "outwear" */}
    </div>
  );
};

export default OutwearPage;
