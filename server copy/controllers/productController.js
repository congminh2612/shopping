const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.createProduct = async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;
  try {
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error });
  }
};
exports.updateProduct = async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;
  try {
    if (category) {
      const foundCategory = await Category.findById(category);
      if (!foundCategory) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        stock,
        images,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getFilteredProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "price",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      const categoryDoc = await Category.findOne({
        $or: [
          { name: category },
          { _id: mongoose.Types.ObjectId.isValid(category) ? category : null },
        ],
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        return res.status(404).json({ message: "Category not found" });
      }
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (inStock) {
      query.stock = inStock === "true" ? { $gt: 0 } : { $lte: 0 };
    }
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category", "name");
    const total = await Product.countDocuments(query);
    res.status(200).json({
      message: "Products retrieved successfully",
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve products", error });
  }
};
