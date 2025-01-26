// backend/controllers/userController.js
const { users } = require("./authController"); 
// ^ wczytujemy tę samą tablicę in-memory (uwaga: w realnym projekcie byłaby DB)

exports.getAllUsers = (req, res) => {
  // Prosty listing wszystkich użytkowników bez hasła:
  const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
  return res.json(safeUsers);
};

exports.getUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: "Użytkownik nie został znaleziony." });
  }
  const { passwordHash, ...rest } = user;
  return res.json(rest);
};

exports.updateUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: "Użytkownik nie został znaleziony." });
  }

  const { email, role } = req.body;
  if (email) user.email = email;
  if (role) user.role = role;

  return res.json({ message: "Użytkownik zaktualizowany.", user });
};

exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Użytkownik nie został znaleziony." });
  }
  users.splice(index, 1);
  return res.json({ message: "Użytkownik usunięty." });
};
