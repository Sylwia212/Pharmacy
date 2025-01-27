const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

let users = [];
let currentId = 1;

exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ message: "Użytkownik już istnieje" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: currentId++,
    email,
    passwordHash,
    role: role || "user",
  };
  users.push(newUser);
  res
    .status(201)
    .json({ id: newUser.id, email: newUser.email, role: newUser.role });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000, // 1h
      sameSite: "Strict",
    });

    return res.status(200).json({
      message: "Zalogowano pomyślnie",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: "Błąd podczas logowania" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Wylogowano pomyślnie" });
};

exports.users = users;
exports.currentId = currentId;
