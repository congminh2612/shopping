const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};
module.exports = checkRole;
