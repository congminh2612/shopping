const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  images: [
    {
      type: String,
    },
  ],
});

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
