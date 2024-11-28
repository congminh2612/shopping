const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Failed to retrieve products", error });
  }
};

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Failed to retrieve product", error });
  }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  const { name, description, price, category, stock, images, attributes } =
    req.body;
  try {
    // Kiểm tra category có hợp lệ không
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Validate attributes nếu có
    if (attributes && !Array.isArray(attributes)) {
      return res.status(400).json({ message: "Attributes must be an array" });
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
      attributes, // Bao gồm attributes
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: "Error creating product", error });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  const { name, description, price, category, stock, images, attributes } =
    req.body;
  try {
    if (category) {
      const foundCategory = await Category.findById(category);
      if (!foundCategory) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    // Validate attributes nếu có
    if (attributes && !Array.isArray(attributes)) {
      return res.status(400).json({ message: "Attributes must be an array" });
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
        attributes, // Bao gồm attributes
        updatedAt: Date.now(),
      },
      { new: true } // Trả về dữ liệu đã cập nhật
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ message: "Error updating product", error });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
};

// Xóa nhiều sản phẩm
exports.deleteMultipleProducts = async (req, res) => {
  const { ids } = req.body; // Danh sách ID sản phẩm cần xóa
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: "IDs must be an array" });
  }
  try {
    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      message: "Products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting multiple products:", error);
    res.status(500).json({ message: "Failed to delete products", error });
  }
};

// Lấy danh sách sản phẩm theo bộ lọc
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
    console.error("Error retrieving filtered products:", error);
    res.status(500).json({ message: "Failed to retrieve products", error });
  }
};
