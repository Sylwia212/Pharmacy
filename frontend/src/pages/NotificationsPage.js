import React from "react";
import { useNotifications } from "../context/NotificationsContext";
import "../styles/NotificationsPage.css";

function NotificationsPage({ userId }) {
  const { notifications } = useNotifications();

  if (!userId) {
    return <p>Musisz być zalogowany, aby zobaczyć powiadomienia.</p>;
  }

  return (
    <div className="notifications-page-container">
      <h2>Powiadomienia</h2>
      {notifications.length > 0 ? (
        <ul className="notifications-list">
          {notifications.map((notif, index) => (
            <li key={index} className="notification-item">
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
