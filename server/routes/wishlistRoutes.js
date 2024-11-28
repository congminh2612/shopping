const express = require("express");
const {
  addItemToWishlist,
  getWishlist,
  removeItemFromWishlist,
  clearWishlist,
  moveToCart,
} = require("../controllers/wishlistController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/", addItemToWishlist);
router.get("/", getWishlist);
router.delete("/:productId", removeItemFromWishlist);
router.delete("/", clearWishlist);
router.post("/move-to-cart", moveToCart);

module.exports = router;
