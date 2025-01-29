const WebSocket = require("ws");

const userClients = new Set();

const setupUserWebSocket = (wss) => {
  wss.on("connection", (ws) => {
    userClients.add(ws);

    ws.on("message", (message) => {
      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on("close", () => {
      userClients.delete(ws);
    });
  });
};

const sendUserNotification = (message) => {
  const payload = JSON.stringify({ type: "notification", message });
  userClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

module.exports = { setupUserWebSocket, sendUserNotification };
