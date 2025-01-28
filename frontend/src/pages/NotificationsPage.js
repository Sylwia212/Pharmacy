import React from "react";
import { useNotifications } from "../context/NotificationsContext";

function NotificationsPage({ userId }) {
  const { notifications } = useNotifications();

  if (!userId) {
    return <p>Musisz być zalogowany, aby zobaczyć powiadomienia.</p>;
  }

  return (
    <div>
      <h2>Powiadomienia</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>
              <strong>{notif.topic}</strong>: {JSON.stringify(notif.payload)}
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak powiadomień.</p>
      )}
    </div>
  );
}

export default NotificationsPage;
