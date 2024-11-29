const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");

// Lấy danh sách sản phẩm theo bộ lọc và sắp xếp
const getFilteredProducts = async (req, res) => {
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
      color, // Lọc theo Màu sắc
      size, // Lọc theo Kích thước
    } = req.query;

    let query = {};

    // Tìm kiếm theo từ khóa
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Lọc theo danh mục
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

    // Lọc theo giá
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Lọc theo trạng thái tồn kho
    if (inStock) {
      query.stock = inStock === "true" ? { $gt: 0 } : { $lte: 0 };
    }

    // Lọc theo attributes (Màu sắc và Kích thước)
    if (color || size) {
      query.attributes = { $elemMatch: {} };
      if (color) {
        query.attributes.$elemMatch.key = "Màu sắc";
        query.attributes.$elemMatch.value = color; // Mã HEX hoặc tên màu
      }
      if (size) {
        query.attributes.$elemMatch.key = "Kích thước";
        query.attributes.$elemMatch.value = size;
      }
    }

    // Cấu hình sắp xếp
    const sortOptions = {};
    if (sortBy === "newest") {
      sortOptions.createdAt = -1; // Sắp xếp mới nhất
    } else if (sortBy === "bestseller") {
      sortOptions.sales = -1; // Sắp xếp theo số lượng bán ra
    } else if (sortBy === "price") {
      sortOptions.price = order === "asc" ? 1 : -1; // Giá tăng/giảm dần
    } else if (sortBy === "name") {
      sortOptions.name = order === "asc" ? 1 : -1; // Tên A-Z hoặc Z-A
    }

    // Phân trang (pagination)
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Truy vấn sản phẩm
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category", "name"); // Lấy thông tin tên danh mục

    // Tổng số sản phẩm thỏa mãn bộ lọc
    const total = await Product.countDocuments(query);

    // Trả về kết quả
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

module.exports = { getFilteredProducts };
