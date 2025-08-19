const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from the request header
  const token = req.header("x-auth-token");

  // Check if there is no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next(); // Move to the next piece of middleware or the route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
