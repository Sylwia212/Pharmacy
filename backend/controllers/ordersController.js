const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Medication = require("../models/Medication");
const Cart = require("../models/Cart");

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");

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

    for (let med of medications) {
      const medication = await Medication.findByPk(med.medicationId);
      if (medication && medication.stock_quantity >= med.quantity) {
        const newQuantity = medication.stock_quantity - med.quantity;
        await medication.update({ stock_quantity: newQuantity });

        client.publish(
          `inventory/updates`,
          JSON.stringify({
            medicationId: med.medicationId,
            newQuantity,
          })
        );
      } else {
        return res
          .status(400)
          .json({ message: `Brak wystarczającej ilości ${medication.name}` });
      }
    }

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

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order)
      return res.status(404).json({ message: "Zamówienie nie znalezione." });

    await Order.update({ status }, { where: { id: orderId } });

    client.publish(
      `orders/user/${order.userId}`,
      JSON.stringify({ orderId, status }),
      (err) => {
        console.error("Błąd publikowania MQTT:", err);
      }
    );

    res.json({ message: "Status zamówienia zaktualizowany." });
  } catch (error) {
    res.status(500).json({ error: "Błąd podczas aktualizacji zamówienia." });
  }
};
