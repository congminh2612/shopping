const { check, validationResult } = require("express-validator");

const validateRegister = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("birthday").isDate().withMessage("Invalid date format for birthday"),
  check("username").matches(/^@\w+/).withMessage("Username must start with @"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character")
    .custom((value, { req }) => {
      if (req.body.email && value.includes(req.body.email.split("@")[0])) {
        throw new Error("Password should not contain parts of the email");
      }
      if (req.body.name && value.includes(req.body.name)) {
        throw new Error("Password should not contain your name");
      }
      return true;
    }),
  // check("gender").notEmpty().withMessage("Gender is required"),
  // check("address").notEmpty().withMessage("Address is required"),
  // check("city").notEmpty().withMessage("City is required"),
  // check("country").notEmpty().withMessage("Country is required"),
  // check("name").notEmpty().withMessage("Name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  check("emailOrUsername")
    .custom((value) => {
      if (value.includes("@") && !value.startsWith("@")) {
        // Nếu là email, kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error("Invalid email format");
        }
      } else if (value.startsWith("@")) {
        // Nếu là username, kiểm tra định dạng username
        const usernameRegex = /^@\w+$/;
        if (!usernameRegex.test(value)) {
          throw new Error("Invalid username format");
        }
      } else {
        throw new Error("Invalid email or username format");
      }
      return true;
    })
    .withMessage("Invalid email or username"),
  check("password").notEmpty().withMessage("Password is required"), // Chỉ kiểm tra không được để trống
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validatePasswordReset = [
  check("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
  check("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Confirm password must match new password");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordReset,
};
