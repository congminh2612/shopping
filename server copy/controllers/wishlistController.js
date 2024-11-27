const Wishlist = require("../models/wishlist");
const Product = require("../models/product");

exports.addItemToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const userId = req.user.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }
    const existingItem = wishlist.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    wishlist.items.push({ productId });
    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add item to wishlist", error });
  }
};
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!wishlist || wishlist.items.length === 0) {
      return res.status(404).json({ message: "Wishlist is empty" });
    }
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve wishlist", error });
  }
};
exports.removeItemFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await wishlist.save();
    res
      .status(200)
      .json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to remove item from wishlist", error });
  }
};
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] },
      { new: true }
    );
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json({ message: "Wishlist cleared", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to clear wishlist", error });
  }
};
