const express = require("express");
const { getFilteredProducts } = require("../controllers/searchController");

const router = express.Router();

router.get("/", getFilteredProducts);

module.exports = router;
