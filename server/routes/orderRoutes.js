const express = require("express");
const {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createOrder); // Create order from cart
router.get("/", authenticate, getOrders); // Get user's orders
router.get("/all", authenticate, checkRole("admin"), getAllOrders); // Admin: Get all orders
router.put(
  "/:orderId/status",
  authenticate,
  checkRole("admin"),
  updateOrderStatus
); // Admin: Update order status

module.exports = router;
