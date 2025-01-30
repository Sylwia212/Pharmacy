const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      passwordHash,
      role: role || "user",
    });

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    console.error("Błąd rejestracji:", err);
    return res.status(500).json({ message: "Błąd podczas rejestracji." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowy email lub hasło." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowy email lub hasło." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwtToken", token, {
      httpOnly: false,
      // secure: false,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: "Zalogowano pomyślnie",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Błąd logowania:", err);
    return res.status(500).json({ message: "Błąd podczas logowania." });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwtToken");
  res.status(200).json({ message: "Wylogowano pomyślnie" });
};
