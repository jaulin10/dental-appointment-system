// Permet d'autoriser certains rôles uniquement
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient role." });
    }
    next();
  };
};

module.exports = authorizeRoles;
