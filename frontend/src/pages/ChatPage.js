import React, { useEffect, useState } from "react";
import "../styles/CartPage.css"

const ChatPage = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      return Number(savedUserId);
    }
    const newUserId = Math.floor(Math.random() * 1000000);
    localStorage.setItem("userId", newUserId);
    return newUserId;
  });

  useEffect(() => {
    const connectWebSocket = () => {
      if (ws && ws.readyState === WebSocket.OPEN) return;

      const socket = new WebSocket("ws://localhost:3000");

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: "register", userId }));
      };

      socket.onmessage = async (event) => {
        try {
          let data =
            event.data instanceof Blob
              ? JSON.parse(await event.data.text())
              : JSON.parse(event.data);
          setMessages((prevMessages) => {
            if (!prevMessages.some((msg) => msg.timestamp === data.timestamp)) {
              return [...prevMessages, data];
            }
            return prevMessages;
          });
        } catch (error) {
          console.error("Błąd parsowania wiadomości WebSocket:", error);
        }
      };

      socket.onclose = () => {
        setTimeout(connectWebSocket, 3000);
      };

      socket.onerror = (error) => {
        console.error("Błąd WebSocket czatu:", error);
      };

      setWs(socket);
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({
        type: "chat",
        senderId: userId,
        content: message,
        timestamp: Date.now(),
      });
      ws.send(payload);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat użytkowników</h2>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <p key={msg.timestamp || index}>
            <strong>{msg.senderId}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Wpisz wiadomość..."
        className="chat-input"
      />
      <button onClick={sendMessage} className="send-btn">
        Wyślij
      </button>
    </div>
  );
};

export default ChatPage;
