const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  const userId = process.env.USER_ID;
  console.log("Połączono z MQTT");
  client.subscribe(`orders/user/${userId}`, (err) => {
    if (err) {
      console.error("Błąd subskrypcji:", err);
    } else {
      console.log("Subskrybujesz temat: orders/user/{userId}");
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`Otrzymano wiadomość z tematu ${topic}:`, message.toString());
});
