import React from "react";
import { useUserWebSocket } from "../context/userWebSocket";

const UserNotifications = () => {
  const { notifications } = useUserWebSocket();

  return (
    <div>
      <h3>Powiadomienia użytkownika</h3>
      <ul>
        {notifications.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotifications;
