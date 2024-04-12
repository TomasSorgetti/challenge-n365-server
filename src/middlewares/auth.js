const jwt = require("jsonwebtoken");
const { SECRET } = process.env;


const verifyAccessToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(404).json({ error: "No token detected" });
  }
  const decoded = jwt.verify(token, SECRET);
  if (!decoded) {
    return res.status(401).json({ error: "unauthorized" });
  }
  req.user = decoded;

  return next();
};

module.exports = {
  verifyAccessToken,
};
