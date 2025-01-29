import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const UserWebSocketContext = createContext();

export const UserWebSocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [stockUpdates, setStockUpdates] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      if (socketRef.current) return;
      const ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {};

      ws.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (error) {
          return;
        }

        if (data.type === "notification") {
          setNotifications((prev) => {
            if (!prev.includes(data.message)) {
              return [...prev, data.message];
            }
            return prev;
          });
        }

        if (data.type === "low_stock" || data.type === "out_of_stock") {
          setStockUpdates((prev) => ({
            ...prev,
            [data.medicationId]: data.newQuantity,
          }));
        }
      };

      ws.onclose = () => {
        socketRef.current = null;
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("Błąd WebSocket:", error);
      };

      socketRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <UserWebSocketContext.Provider value={{ notifications, stockUpdates }}>
      {children}
    </UserWebSocketContext.Provider>
  );
};

export const useUserWebSocket = () => useContext(UserWebSocketContext);
