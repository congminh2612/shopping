const express = require("express");
const {
  addItemToWishlist,
  getWishlist,
  removeItemFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/", addItemToWishlist);
router.get("/", getWishlist);
router.delete("/:productId", removeItemFromWishlist);
router.delete("/", clearWishlist);

module.exports = router;
