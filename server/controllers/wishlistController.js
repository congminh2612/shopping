const Wishlist = require("../models/wishlist");
const Product = require("../models/product");
const Cart = require("../models/cart");

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
// exports.moveToCart = async (req, res) => {
//   const { productId } = req.body;
//   try {
//     const userId = req.user.id;

//     // Tìm sản phẩm trong Wishlist
//     const wishlist = await Wishlist.findOne({ userId });
//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     const productInWishlist = wishlist.items.find(
//       (item) => item.productId.toString() === productId
//     );
//     if (!productInWishlist) {
//       return res.status(404).json({ message: "Product not found in Wishlist" });
//     }

//     // Kiểm tra tồn kho sản phẩm
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     if (product.stock < 1) {
//       return res.status(400).json({
//         message: `Product ${product.name} is out of stock`,
//       });
//     }

//     // Thêm sản phẩm vào Cart
//     let cart = await Cart.findOne({ userId });
//     if (!cart) {
//       cart = new Cart({ userId, items: [] });
//     }

//     const existingItem = cart.items.find(
//       (item) => item.productId.toString() === productId
//     );
//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       cart.items.push({
//         productId,
//         name: product.name,
//         priceAtPurchase: product.price,
//         quantity: 1,
//       });
//     }
//     await cart.save();

//     // Xóa sản phẩm khỏi Wishlist
//     wishlist.items = wishlist.items.filter(
//       (item) => item.productId.toString() !== productId
//     );
//     await wishlist.save();

//     res.status(200).json({ message: "Product moved to Cart", cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to move product to Cart", error });
//   }
// };

exports.moveToCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist || wishlist.items.length === 0) {
      return res.status(404).json({ message: "Wishlist is empty" });
    }

    // Retrieve all products in the wishlist
    const productIds = wishlist.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "Products not found in Wishlist" });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Iterate over products and add to the cart
    products.forEach((product) => {
      if (product.stock < 1) {
        // Skip out-of-stock products
        return;
      }

      const existingItem = cart.items.find(
        (item) => item.productId.toString() === product._id.toString()
      );

      if (existingItem) {
        // Update quantity if the product is already in the cart
        existingItem.quantity += 1;
      } else {
        // Add new product to the cart
        cart.items.push({
          productId: product._id,
          name: product.name,
          priceAtPurchase: product.price,
          quantity: 1,
        });
      }
    });

    // Save the updated cart
    await cart.save();

    // Clear the wishlist
    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({ message: "All products moved to Cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to move products to Cart", error });
  }
};
