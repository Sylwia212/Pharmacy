const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

module.exports = (req, res, next) => {
  const token = req.cookies.authToken; 
  if (!token) {
    return res.status(401).json({ message: "Brak autoryzacji, zaloguj się." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Nieprawidłowy token" });
  }
};
