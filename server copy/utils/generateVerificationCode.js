const crypto = require("crypto");
const generateVerificationCode = () => {
  const code = crypto.randomInt(100000, 999999).toString();
  const expiry = new Date(Date.now() + 15 * 60 * 1000);
  return { code, expiry };
};

module.exports = generateVerificationCode;
