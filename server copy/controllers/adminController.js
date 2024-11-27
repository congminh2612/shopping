const User = require("../models/User");
const hashPassword = require("../utils/hashPassword");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "-password -resetPasswordToken -verificationCode"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.addUser = async (req, res) => {
  // console.log("Request body:", req.body);
  const {
    name,
    email,
    birthday,
    username,
    password,
    role = "user",
    gender = "other",
    address,
    city,
    country,
  } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      birthday,
      username,
      password: hashedPassword,
      role,
      gender,
      address,
      city,
      country,
    });
    await newUser.save();
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({
      message: "User added successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error adding user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, username, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, username, role },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, resetPasswordToken, verificationCode, ...safeUser } =
      updatedUser.toObject();
    res.status(200).json({
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    await User.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getSystemLogs = async (req, res) => {
  try {
    // Logic lấy logs hệ thống
    const logs = []; // Ví dụ: Fetch logs từ cơ sở dữ liệu hoặc file
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve logs" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    // Logic phân tích dữ liệu
    const analytics = {}; // Ví dụ: Fetch analytics từ DB
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve analytics" });
  }
};
