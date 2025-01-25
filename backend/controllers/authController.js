const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

let users = [];
let currentId = 1;

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Użytkownik o tym emailu już istnieje." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: currentId++,
      email,
      passwordHash,
      role: role || "user",
    };
    users.push(newUser);

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Błąd podczas rejestracji." });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowe dane logowania (email)." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowe dane logowania (hasło)." });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Błąd podczas logowania." });
  }
};
