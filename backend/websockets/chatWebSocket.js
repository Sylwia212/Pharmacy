const WebSocket = require("ws");

const clients = new Set();

const setupChatWebSocket = (wss) => {
  wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());

        const chatMessage = JSON.stringify({
          type: "chat",
          senderId: parsedMessage.senderId,
          content: parsedMessage.content,
        });

        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(chatMessage);
          }
        });
      } catch (error) {
        console.error("Błąd przetwarzania wiadomości WebSocket:", error);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });
};

module.exports = { setupChatWebSocket };
