import React, { createContext, useContext, useState, useEffect } from "react";

const UserWebSocketContext = createContext();

export const UserWebSocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("Połączono z WebSocket użytkownika");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        setNotifications((prev) => [...prev, data.message]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket użytkownika rozłączony");
    };

    return () => ws.close();
  }, []);

  return (
    <UserWebSocketContext.Provider value={{ notifications }}>
      {children}
    </UserWebSocketContext.Provider>
  );
};

export const useUserWebSocket = () => useContext(UserWebSocketContext);
