import React, { createContext, useContext, useState, useEffect } from "react";

const UserWebSocketContext = createContext();

export const UserWebSocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [stockUpdates, setStockUpdates] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {
        console.log("Połączono z WebSocket użytkownika");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "notification") {
          setNotifications((prev) => [...prev, data.message]);
        }
        if (data.type === "low_stock" || data.type === "out_of_stock") {
          setStockUpdates((prev) => ({
            ...prev,
            [data.medicationId]: data.newQuantity,
          }));
        }
      };

      ws.onclose = () => {
        console.log("WebSocket użytkownika rozłączony");
        setTimeout(connectWebSocket, 3000);
      };
      setSocket(ws);
    };
    connectWebSocket();
    return () => {
      if (socket) socket.close();
    };
  }, []);

  return (
    <UserWebSocketContext.Provider value={{ notifications, stockUpdates }}>
      {children}
    </UserWebSocketContext.Provider>
  );
};

export const useUserWebSocket = () => useContext(UserWebSocketContext);
