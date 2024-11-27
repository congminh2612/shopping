const express = require("express");
const {
  addItemToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/", addItemToCart);
router.get("/", getCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);

module.exports = router;
