const Order = require("../models/Order");
const Medication = require("../models/Medication");
const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://broker.hivemq.com", {
  clientId: `order_service_${Math.random().toString(16).substr(2, 8)}`,
  clean: true,
});

client.on("connect", () => {
  console.log("Połączono z brokerem MQTT");
});

client.on("error", (err) => {
  console.error("Błąd połączenia MQTT:", err);
});

client.on("offline", () => {
  console.warn("Klient MQTT jest offline");
});

client.on("reconnect", () => {
  console.log("Ponowne łączenie z brokerem MQTT...");
});

const publishMessage = (topic, message) => {
  console.log(`Próba publikacji wiadomości na temat: ${topic}`);
  if (client.connected) {
    client.publish(topic, message, (err) => {
      if (err) {
        console.error(`Błąd publikowania MQTT na temat ${topic}:`, err);
      } else {
        console.log(
          `Wiadomość została opublikowana na temat ${topic}: ${message}`
        );
      }
    });
  } else {
    console.error(
      "Klient MQTT nie jest połączony, wiadomość nie została opublikowana."
    );
  }
};

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

        publishMessage(
          `inventory/updates`,
          JSON.stringify({
            medicationId: med.medicationId,
            newQuantity,
            type: "inventory_update",
            message: `Zaktualizowano stan magazynowy dla leku ${medication.name}`,
          })
        );
      } else {
        return res.status(400).json({
          message: `Brak wystarczającej ilości ${
            medication?.name || "produktu"
          }`,
        });
      }
    }

    publishMessage(
      `orders/user/${userId}`,
      JSON.stringify({
        orderId: newOrder.id,
        status: "pending",
        type: "order_created",
        message: `Nowe zamówienie zostało złożone o ID ${newOrder.id}`,
      })
    );

    res
      .status(201)
      .json({ message: "Zamówienie złożone pomyślnie", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Błąd serwera podczas składania zamówienia." });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Zamówienie nie znalezione." });
    }

    await order.update({ status });

    publishMessage(
      `orders/user/${order.userId}`,
      JSON.stringify({
        orderId: order.id,
        status,
        type: "order_status_update",
        message: `Status zamówienia ${order.id} został zmieniony na ${status}`,
      })
    );

    res.json({ message: "Status zamówienia zaktualizowany." });
  } catch (error) {
    console.error("Błąd podczas aktualizacji zamówienia:", error);
    res.status(500).json({ message: "Błąd podczas aktualizacji zamówienia." });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({ where: { userId } });
    res.json(orders);
  } catch (error) {
    console.error("Błąd podczas pobierania zamówień:", error);
    res.status(500).json({ message: "Błąd podczas pobierania zamówień." });
  }
};
