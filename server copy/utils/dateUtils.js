const getExpiryDate = (days = 7) => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

module.exports = getExpiryDate;
