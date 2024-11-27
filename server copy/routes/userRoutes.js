const express = require("express");
const { getCategories } = require("../controllers/categoryController");

const { getProducts } = require("../controllers/productController");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.use(checkRole("user"));

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.get("/categories", getCategories);
router.get("/products", getProducts);

module.exports = router;
