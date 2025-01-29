import React, { createContext, useContext, useState, useEffect } from "react";
import mqtt from "mqtt";

const NotificationsContext = createContext();
const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";
const WS_URL = "ws://localhost:3000"; 

export const NotificationsProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [medications, setMedications] = useState({});

  useEffect(() => {
    if (!userId) return;

    const fetchMedications = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/medications");
        const data = await response.json();
        const medsMap = {};
        data.forEach((med) => {
          medsMap[med.id] = med.name;
        });
        setMedications(medsMap);

        setNotifications((prev) => {
          const inventoryNotifications = data
            .filter((med) => med.stock_quantity < 20)
            .map((med) => ({
              topic: "inventory/updates",
              payload: {
                medicationId: med.id,
                newQuantity: med.stock_quantity,
                name: med.name,
                type: "low_stock",
              },
            }));

          const orderNotifications = prev.filter(
            (n) => !n.topic.includes("inventory/updates")
          );

          return [...orderNotifications, ...inventoryNotifications];
        });
      } catch (error) {
        console.error("Błąd pobierania leków:", error);
      }
    };

    fetchMedications();

    const interval = setInterval(fetchMedications, 10000);

    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        addNotification("inventory/updates", payload);
      } catch (error) {
        console.error("Błąd parsowania WebSocket:", error);
      }
    };

    const client = mqtt.connect(BROKER_URL, {
      clientId: `client_${userId}_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
    });

    client.on("connect", () => {
      client.subscribe(
        [`orders/user/${userId}`, "inventory/updates"],
        (err) => {
          if (err) console.error("Błąd subskrypcji:", err);
        }
      );
    });

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());

        if (topic.includes(`orders/user/${userId}`)) {

          addNotification(topic, {
            orderId: payload.orderId,
            status: payload.status || "Złożone",
            message: `Złożono zamówienie o ID ${payload.orderId}`,
            type: "order",
          });

          fetchMedications(); 
        }

        if (topic.includes("inventory/updates")) {
          updateNotification(topic, payload);
        }
      } catch (error) {
        console.error("Błąd parsowania MQTT:", error);
      }
    });

    return () => {
      clearInterval(interval);
      ws.close();
      client.end();
    };
  }, [userId]);

  const updateNotification = (topic, payload) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.payload.medicationId === payload.medicationId
          ? {
              ...n,
              payload: {
                ...payload,
                name: medications[payload.medicationId] || "Nieznany lek",
                type: "low_stock",
              },
            }
          : n
      );

      const exists = updated.some(
        (n) => n.payload.medicationId === payload.medicationId
      );
      if (!exists) {
        updated.push({
          topic,
          payload: {
            ...payload,
            name: medications[payload.medicationId] || "Nieznany lek",
            type: "low_stock",
          },
        });
      }

      return updated;
    });
  };

  const addNotification = (topic, payload) => {
    setNotifications((prev) => {
      const exists = prev.some(
        (n) => JSON.stringify(n.payload) === JSON.stringify(payload)
      );
      if (exists) return prev;

      const updated = [...prev, { topic, payload }];
      return updated;
    });
  };

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
