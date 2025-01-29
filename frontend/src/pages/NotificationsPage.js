import React from "react";
import { useNotifications } from "../context/NotificationsContext";
import "../styles/NotificationsPage.css";

function NotificationsPage() {
  const { notifications } = useNotifications();

  return (
    <div className="notifications-page-container">
      <h2>Powiadomienia</h2>
      {notifications.length > 0 ? (
        <ul className="notifications-list">
          {notifications.map((notif, index) => (
            <li key={index} className="notification-item">
              <strong>Typ powiadomienia:</strong>{" "}
              {notif.payload.type === "order_created"
                ? "Nowe zamówienie"
                : "Zmiana statusu zamówienia"}
              <br />
              <strong>Treść:</strong> {notif.payload.message}
              <br />
              <strong>Status:</strong> {notif.payload.status}
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
