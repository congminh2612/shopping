const crypto = require("crypto");
const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpiry = new Date(Date.now() + 15 * 60 * 1000);
  return { resetToken, resetExpiry };
};

module.exports = generateResetToken;
