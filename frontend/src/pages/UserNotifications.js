import React from "react";
import { useUserWebSocket } from "../context/userWebSocket";
import "../styles/UserNotifications.css"

const UserNotifications = () => {
  const { notifications } = useUserWebSocket();

  return (
    <div className="notifications-container">
      <h3>Powiadomienia użytkownika</h3>
      <ul className="notifications-list">
        {notifications.map((msg, index) => (
          <li key={index} className="notification-item">{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotifications;
