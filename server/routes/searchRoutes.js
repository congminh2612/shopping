const express = require("express");
const { getFilteredProducts } = require("../controllers/productController");

const router = express.Router();

router.get("/", getFilteredProducts);

module.exports = router;
