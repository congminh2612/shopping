const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    birthday: { type: Date, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "./path/to/default/avatar.png" },
    bio: { type: String, required: false },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    address: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    phone: { type: String, unique: true, required: false }, // 🔴
    role: { type: String, required: true, enum: ["admin", "manager", "user"] },
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: "" },
    verificationExpiry: { type: Date, default: null },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpiry: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
