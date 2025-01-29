import React, { createContext, useContext, useState, useEffect } from "react";

const ChatWebSocketContext = createContext();

export const ChatWebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

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
      const ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "register", userId }));
        setSocket(ws);
      };

      ws.onmessage = async (event) => {
        try {
          let textData = event.data;

          if (event.data instanceof Blob) {
            textData = await event.data.text();
          }

          const data = JSON.parse(textData);

          if (data.type === "chat") {
            setMessages((prev) => [...prev, data]);
          }
        } catch (error) {}
      };

      ws.onclose = () => {
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {};

      setSocket(ws);
    };

    connectWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const sendMessage = (content) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({
        type: "chat",
        senderId: userId,
        content,
        timestamp: Date.now(),
      });
      socket.send(payload);
    }
  };

  return (
    <ChatWebSocketContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatWebSocketContext.Provider>
  );
};

export const useChatWebSocket = () => useContext(ChatWebSocketContext);
