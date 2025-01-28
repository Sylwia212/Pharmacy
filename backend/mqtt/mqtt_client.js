const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  console.log("Połączono z MQTT");
  client.subscribe("orders/#", (err) => {
    if (err) {
      console.error("Błąd subskrypcji:", err);
    } else {
      console.log("Subskrybujesz temat: orders/#");
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`Otrzymano wiadomość z tematu ${topic}:`, message.toString());
});
