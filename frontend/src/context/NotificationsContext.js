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

    client.on("connect", () => {
      const orderTopic = `orders/user/${userId}`;
      const inventoryTopic = "inventory/updates";

      client.subscribe(orderTopic, (err) => {
        if (err) console.error("Błąd subskrypcji zamówień:", err);
        else console.log(`Subskrybowano: ${orderTopic}`);
      });

      client.subscribe(inventoryTopic, (err) => {
        if (err) console.error("Błąd subskrypcji magazynu:", err);
        else console.log(`Subskrybowano: ${inventoryTopic}`);
      });
    });

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

    client.on("error", (error) => {
      console.error("Błąd MQTT:", error);
    });

    return () => {
      client.end();
    };
  }, [userId]);

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
