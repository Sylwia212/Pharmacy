const Cart = require("../models/Cart");
const Medication = require("../models/Medication");

exports.addToCart = async (req, res) => {
  try {
    const { userId, medicationId, quantity } = req.body;

    const medication = await Medication.findByPk(medicationId);
    if (!medication) {
      return res.status(404).json({ message: "Lek nie istnieje" });
    }

    let cartItem = await Cart.findOne({
      where: { userId, medicationId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, medicationId, quantity });
    }

    res.status(200).json({ message: "Dodano do koszyka", cartItem });
  } catch (error) {
    console.error("Błąd podczas dodawania do koszyka:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Medication }],
    });

    if (cartItems.length === 0) {
      return res.status(200).json({ message: "Koszyk jest pusty" });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Błąd pobierania koszyka" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.destroy({ where: { id } });
    res.status(200).json({ message: "Produkt usunięty z koszyka" });
  } catch (error) {
    res.status(500).json({ message: "Błąd usuwania produktu" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.destroy({ where: { userId } });

    res.status(200).json({ message: "Koszyk został wyczyszczony." });
  } catch (error) {
    console.error("Błąd podczas czyszczenia koszyka:", error);
    res.status(500).json({ message: "Błąd podczas czyszczenia koszyka." });
  }
};
