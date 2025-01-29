import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import mqtt from "mqtt";

const NotificationsContext = createContext();
const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";

export const NotificationsProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [medications, setMedications] = useState({});
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    fetch("http://localhost:3000/api/medications/low-stock")
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          return;
        }

        const medsMap = {};
        data.forEach((med) => {
          medsMap[med.id] = med.name;
        });

        setMedications(medsMap);

        setNotifications(
          data.map((med) => ({
            topic: "inventory/updates",
            payload: {
              type: "low_stock",
              medicationId: med.id,
              name: med.name || "Nieznany lek",
              newQuantity: med.stock_quantity,
            },
          }))
        );
      })
      .catch((error) =>
        console.error("Błąd pobierania niskiego stanu:", error)
      );

    if (!clientRef.current) {
      const client = mqtt.connect(BROKER_URL, {
        clientId: `client_${userId}_${Math.random().toString(16).substr(2, 8)}`,
        clean: true,
        connectTimeout: 4000,
      });

      client.on("connect", () => {
        client.subscribe("inventory/updates", (err) => {
          if (err) console.error("Błąd subskrypcji:", err);
          else console.log(`Subskrybowano: inventory/updates`);
        });
      });

      client.on("message", (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());

          if (
            !payload.medicationId ||
            payload.newQuantity === undefined ||
            payload.newQuantity >= 20
          ) {
            return;
          }

          setNotifications((prev) => {
            let found = false;
            const updatedNotifications = prev.map((n) => {
              if (n.payload.medicationId === payload.medicationId) {
                found = true;
                return {
                  ...n,
                  payload: {
                    ...payload,
                    name: medications[payload.medicationId] || "Nieznany lek",
                  },
                };
              }
              return n;
            });

            if (!found) {
              return [
                ...prev,
                {
                  topic,
                  payload: {
                    ...payload,
                    name: medications[payload.medicationId] || "Nieznany lek",
                  },
                },
              ];
            }

            return updatedNotifications;
          });
        } catch (error) {
          console.error("Błąd parsowania wiadomości MQTT:", error);
        }
      });

      client.on("error", (error) => {
        console.error("Błąd MQTT:", error);
      });

      clientRef.current = client;
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
        clientRef.current = null;
      }
    };
  }, [userId]);
  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
