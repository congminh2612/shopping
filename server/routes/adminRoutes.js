const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/categoryController");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} = require("../controllers/productController");

const {
  getAllUsers,
  updateUser,
  deleteUser,
  getSystemLogs,
  getAnalytics,
} = require("../controllers/adminController");

const { checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(checkRole("admin"));

//categories
router.get("/categories", getCategories);
router.post("/category", createCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

//products
router.get("/products", getProducts);
router.post("/product", createProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

//user
router.get("/users", getAllUsers);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
// permission other
router.get("/logs", getSystemLogs);
router.get("/analytics", getAnalytics);

module.exports = router;
