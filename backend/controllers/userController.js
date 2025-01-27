const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role"],
    });
    res.json(users);
  } catch (error) {
    console.error("Błąd pobierania użytkowników:", error);
    res.status(500).json({ message: "Błąd podczas pobierania użytkowników." });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await User.findByPk(id, {
      attributes: ["id", "email", "role"],
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony." });
    }
    res.json(user);
  } catch (error) {
    console.error("Błąd pobierania użytkownika:", error);
    res.status(500).json({ message: "Błąd podczas pobierania użytkownika." });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Użytkownik nie został znaleziony." });
    }

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "Użytkownik zaktualizowany.", user });
  } catch (error) {
    console.error("Błąd podczas aktualizacji użytkownika:", error);
    res.status(500).json({ message: "Błąd podczas aktualizacji użytkownika." });
  }
};

exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    await user.destroy();
    return res.status(200).json({ message: "Użytkownik usunięty" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Błąd serwera podczas usuwania użytkownika" });
  }
};
