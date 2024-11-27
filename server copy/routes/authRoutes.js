const express = require("express");
const {
  register,
  resendVerificationCode,
  verify,
  login,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
  validatePasswordReset,
} = require("../middleware/validationMiddleware");
const User = require("../models/User");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/resend-verification", resendVerificationCode);
router.post("/verify", verify);
router.post("/login", validateLogin, login);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", validatePasswordReset, resetPassword);

router.delete("/clear-users", async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.status(200).json({ message: "All users cleared", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
