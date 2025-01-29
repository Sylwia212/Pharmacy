require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const WebSocket = require("ws");

const sequelize = require("./config/database");
const Medication = require("./models/Medication");
const User = require("./models/User");

const { setupInventoryWebSocket } = require("./websockets/inventoryWebSocket");
const { setupUserWebSocket } = require("./websockets/userWebSocket");
const { setupChatWebSocket } = require("./websockets/chatWebSocket");

const mqttClient = require("./mqtt/inventoryMqtt");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const medicationRoutes = require("./routes/medication.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

setupInventoryWebSocket(wss); 
setupUserWebSocket(wss); 
setupChatWebSocket(wss);

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/secret", authenticateToken, (req, res) => {
  return res.json({
    message: `Tajne dane dla użytkownika: ${req.user.email}`,
  });
});

app.get("/", (req, res) => {
  res.send("Serwer działa poprawnie!");
});

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  client.subscribe("orders/status", (err) => {
    if (err) {
      console.error("Błąd subskrypcji MQTT:", err);
    } else {
      console.log("Subskrybowano temat: orders/status");
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`MQTT [${topic}]: ${message.toString()}`);
});

sequelize
  .sync({ alter: true })
  .then(() => console.log("Baza danych zsynchronizowana"))
  .catch((err) => console.error("Błąd synchronizacji bazy danych:", err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
