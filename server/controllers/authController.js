const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const generateVerificationCode = require("../utils/generateVerificationCode");
const hashPassword = require("../utils/hashPassword");
const generateResetToken = require("../utils/generateResetToken");

exports.register = async (req, res) => {
  const { name, email, birthday, username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const { code, expiry } = generateVerificationCode();
    const newUser = new User({
      name,
      email,
      birthday,
      username,
      password: hashedPassword,
      role: role || "user",
      verificationCode: code,
      verificationExpiry: expiry,
      isActive: false,
      isVerified: false,
    });
    await newUser.save();
    await sendMail(email, "verification", { code });
    res.status(201).json({
      message: "User registered successfully. Verification code sent to email.",
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resendVerificationCode = async (req, res) => {
  const { emailOrUsername } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const { code, expiry } = generateVerificationCode();
    user.verificationCode = code;
    user.verificationExpiry = expiry;

    await user.save();
    await sendMail(user.email, "verification", { code });

    res.status(200).json({ message: "Verification code resent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verify = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res
      .status(400)
      .json({ message: "Email and verification code are required." });
  }

  try {
    const user = await User.findOne({ email, verificationCode: code });

    if (!user) {
      return res.status(404).json({
        message: "User not found or invalid verification code.",
      });
    }
    user.isVerified = true;
    user.isActive = true;
    user.verificationCode = "";
    user.verificationExpiry = null;
    user.verificationCode = null;
    await user.save();

    return res.status(200).json({
      message: "Verification successful. Your account has been activated.",
    });
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ message: "System error." });
  }
};

// exports.login = async (req, res) => {
//   const { emailOrUsername, password } = req.body;
//   try {
//     const user = await User.findOne({
//       $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
//     });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (!user.isActive) {
//       return res.status(403).json({
//         message: "Account not verified. Please verify your account first.",
//       });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid password" });
//     }
//     user.lastLogin = new Date();
//     await user.save();
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     console.error("Error during login:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account not verified. Please verify your account first.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and user details
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { emailOrUsername } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { resetToken, resetExpiry } = generateResetToken();
    user.resetPasswordToken = await hashPassword(resetToken);
    user.resetPasswordExpiry = resetExpiry;
    await user.save();

    await sendMail(user.email, "passwordReset", { token: resetToken });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error during password reset request:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const token = req.headers.authorization;
  const { newPassword } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Authorization token is required" });
  }
  try {
    const user = await User.findOne({
      resetPasswordExpiry: { $gt: new Date() },
      resetPasswordToken: { $exists: true },
    });
    if (!user || !(await bcrypt.compare(token, user.resetPasswordToken))) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
