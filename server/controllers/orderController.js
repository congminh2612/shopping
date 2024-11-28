const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const sendMail = require("../utils/sendMail");

/**
 * Create a new order from the cart
 */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Kiểm tra email người dùng
    if (!req.user || !req.user.email) {
      console.error("User email not found:", req.user);
      return res.status(400).json({ message: "User email is not available" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => {
      if (!item.productId || !item.productId._id) {
        throw new Error(`Product not found for item in cart`);
      }
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price,
      };
    });

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.priceAtPurchase,
      0
    );

    const order = new Order({
      userId,
      items: orderItems,
      totalPrice,
      status: "pending",
    });

    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    // Gửi email xác nhận
    try {
      console.log("Sending order confirmation to:", req.user.email);
      await sendMail(req.user.email, "orderConfirmation", {
        orderId: order._id,
        totalAmount: totalPrice,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      // Email không được gửi nhưng không ảnh hưởng đến Order
    }

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

/**
 * Get all orders for the user
 */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: "items.productId",
        select: "name price", // Chỉ lấy các trường cần thiết
      })
      .lean(); // Chuyển kết quả sang dạng JSON thuần để dễ xử lý

    // Kiểm tra nếu productId bị null, thêm thông báo để xử lý lỗi
    const updatedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        if (!item.productId) {
          return {
            ...item,
            productId: "Product deleted or not found", // Thay thế giá trị null
          };
        }
        return item;
      }),
    }));

    res.status(200).json({ orders: updatedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

/**
 * Get all orders (admin only)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

/**
 * Update order status (admin only)
 */
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status", error });
  }
};
