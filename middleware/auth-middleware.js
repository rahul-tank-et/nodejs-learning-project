const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Check token available or not
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided. please login to continue",
    });
  }

  // Decode token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Access denied. No token provided. please login to continue",
    });
  }
};

module.exports = authMiddleware;
