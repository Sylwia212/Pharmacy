const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Brak tokena, zaloguj się." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Nieprawidłowy token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Błąd JWT:", error);
    return res
      .status(403)
      .json({ message: "Nieprawidłowy lub wygasły token." });
  }
};
