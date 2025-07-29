// middleware/authorize.js
const asyncHandler = require("express-async-handler");

// Pass allowed roles like: authorizeRoles('admin', 'staff')
const authorizeRoles = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  });

module.exports = authorizeRoles;
