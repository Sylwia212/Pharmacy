import React, { createContext, useContext, useState, useEffect } from "react";
import mqtt from "mqtt";

const NotificationsContext = createContext();
const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";

export const NotificationsProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || []
  );

  useEffect(() => {
    if (!userId) return;

    const client = mqtt.connect(BROKER_URL, {
      clientId: `client_${userId}_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
    });

    client.on("connect", () => client.subscribe(`orders/user/${userId}`));
    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        setNotifications((prev) => {
          const updated = [...prev, { topic, payload }];
          localStorage.setItem("notifications", JSON.stringify(updated));
          return updated;
        });
      } catch (error) {
        console.error("Błąd parsowania wiadomości MQTT:", error);
      }
    });

    return () => client.end();
  }, [userId]);

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
