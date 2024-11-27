const getExpiryDate = (days = 7) => {
  if (typeof days !== "number" || days < 0) {
    throw new Error("Invalid value for 'days'. It must be a positive number.");
  }
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};
module.exports = getExpiryDate;
