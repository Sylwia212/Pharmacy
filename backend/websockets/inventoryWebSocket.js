const WebSocket = require("ws");

const inventoryClients = new Set();
const sentNotifications = new Set();

const setupInventoryWebSocket = (wss) => {
  wss.on("connection", (ws) => {
    inventoryClients.add(ws);

    ws.on("close", () => {
      inventoryClients.delete(ws);
      console.log("Klient WebSocket odłączony");
    });

    ws.on("error", (err) => {
      console.error("Błąd WebSocket:", err);
    });
  });
};

const notifyInventoryChange = (medicationId, newQuantity) => {
  let messageType = null;

  if (newQuantity === 0) {
    messageType = "out_of_stock";
  } else if (newQuantity < 20) {
    messageType = "low_stock";

    if (sentNotifications.has(medicationId)) {
      return;
    }

    sentNotifications.add(medicationId);
  } else {
    return;
  }

  const message = JSON.stringify({
    type: messageType,
    medicationId,
    newQuantity,
  });

  inventoryClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  setTimeout(() => {
    sentNotifications.delete(medicationId);
  }, 5 * 60 * 1000);
};

module.exports = { setupInventoryWebSocket, notifyInventoryChange };
