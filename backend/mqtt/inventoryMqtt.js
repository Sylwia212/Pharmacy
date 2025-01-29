const mqtt = require("mqtt");
const { notifyInventoryChange } = require("../websockets/inventoryWebSocket");

const MQTT_BROKER = "mqtt://broker.hivemq.com";
const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
  console.log("Połączono z brokerem MQTT");

  client.subscribe("inventory/updates", (err) => {
    if (err) {
      console.error("Błąd subskrypcji MQTT:", err);
    } else {
      console.log("Subskrybowano temat: inventory/updates");
    }
  });
});

client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    if (data.newQuantity < 20) {
      notifyInventoryChange(data.medicationId, data.newQuantity);
    }
  } catch (error) {
    console.error("Błąd parsowania wiadomości MQTT:", error);
  }
});

module.exports = client;
