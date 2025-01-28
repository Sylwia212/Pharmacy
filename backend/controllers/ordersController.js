const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Medication = require("../models/Medication");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    const { userId, address, medications } = req.body;

    if (!userId || !address || !medications || medications.length === 0) {
      return res.status(400).json({ message: "Brak wymaganych danych." });
    }

    const newOrder = await Order.create({
      userId,
      address,
      status: "pending",
    });

    const orderItems = medications.map((med) => ({
      orderId: newOrder.id,
      medicationId: med.medicationId,
      quantity: med.quantity,
    }));

    await OrderItem.bulkCreate(orderItems);

    await Cart.destroy({ where: { userId } });

    res
      .status(201)
      .json({ message: "Zamówienie złożone pomyślnie", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Błąd serwera podczas składania zamówienia." });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: [Medication] }],
    });

    res.json(orders);
  } catch (error) {
    console.error("Błąd pobierania zamówień:", error);
    res.status(500).json({ message: "Błąd podczas pobierania zamówień." });
  }
};
