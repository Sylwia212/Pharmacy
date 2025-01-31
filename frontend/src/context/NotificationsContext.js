import React, { createContext, useContext, useState, useEffect } from "react";
import mqtt from "mqtt";

const NotificationsContext = createContext();
const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";

const loadNotificationsFromStorage = () => {
  const storedNotifications = localStorage.getItem("notifications");
  return storedNotifications ? JSON.parse(storedNotifications) : [];
};

const saveNotificationsToStorage = (notifications) => {
  localStorage.setItem("notifications", JSON.stringify(notifications));
};

export const NotificationsProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState(
    loadNotificationsFromStorage
  );
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
      } catch (error) {
        console.error("Błąd pobierania leków:", error);
      }
    };

    fetchMedications();

    const client = mqtt.connect(BROKER_URL, {
      clientId: `client_${userId}_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
    });

    client.on("connect", () => {
      client.subscribe(
        ["orders/user/" + userId, "inventory/updates"],
        (err) => {
          if (err) console.error("Błąd subskrypcji:", err);
        }
      );
    });

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());

        if (topic === `orders/user/${userId}`) {
          handleOrderNotification(topic, payload);
        }

        if (topic.includes("inventory/updates")) {
          handleInventoryUpdate(topic, payload);
        }
      } catch (error) {
        console.error("Błąd parsowania MQTT:", error);
      }
    });

    return () => {
      client.end();
    };
  }, [userId]);

  const handleOrderNotification = (topic, payload) => {
    if (payload.type === "order_created") {
      addNotification(topic, {
        orderId: payload.orderId,
        message: `Złożono nowe zamówienie o ID ${payload.orderId}`,
        status: payload.status || "pending",
        type: "order_created",
      });
    } else if (payload.type === "order_status_update") {
      addNotification(topic, {
        orderId: payload.orderId,
        message: `Zaktualizowano status zamówienia ${payload.orderId} na ${payload.status}`,
        status: payload.status,
        type: "order_status_update",
      });
    }
  };

  const handleInventoryUpdate = (topic, payload) => {
    updateNotification(topic, {
      ...payload,
      message: `Stan magazynowy dla ${
        medications[payload.medicationId] || "lek"
      } zmieniony na ${payload.newQuantity}`,
    });
  };

  const updateNotification = (topic, payload) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.payload.medicationId === payload.medicationId
          ? {
              ...n,
              payload: {
                ...payload,
                name: medications[payload.medicationId] || "Nieznany lek",
              },
            }
          : n
      );

      if (
        !updated.some((n) => n.payload.medicationId === payload.medicationId)
      ) {
        updated.push({
          topic,
          payload: {
            ...payload,
            name: medications[payload.medicationId] || "Nieznany lek",
          },
        });
      }

      saveNotificationsToStorage(updated);
      return updated;
    });
  };

  const addNotification = (topic, payload) => {
    setNotifications((prev) => {
      const existingNotification = prev.find(
        (n) =>
          n.payload.orderId === payload.orderId &&
          n.payload.type === payload.type
      );

      if (existingNotification) {
        const updatedNotifications = prev.map((n) =>
          n === existingNotification
            ? {
                ...n,
                payload: {
                  ...n.payload,
                  message: payload.message,
                  status: payload.status,
                },
              }
            : n
        );

        saveNotificationsToStorage(updatedNotifications);
        return updatedNotifications;
      }

      const newNotifications = [...prev, { topic, payload }];
      saveNotificationsToStorage(newNotifications);
      return newNotifications;
    });
  };

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
