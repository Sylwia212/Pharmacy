import React from "react";
import { useNotifications } from "../context/NotificationsContext";

const InventoryNotifications = () => {
  const { notifications } = useNotifications();

  return (
    <div>
      <h3>Powiadomienia o niskim stanie magazynowym</h3>
      <ul>
        {notifications
          .filter((msg) => msg.payload.newQuantity < 20)
          .map((msg, index) => (
            <li
              key={index}
              style={{
                color: msg.payload.newQuantity === 0 ? "red" : "orange",
              }}
            >
              {msg.payload.newQuantity === 0
                ? `${msg.payload.name} jest WYPRZEDANY!`
                : `Niski stan magazynowy dla ${msg.payload.name} (Pozostało: ${msg.payload.newQuantity})`}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default InventoryNotifications;
