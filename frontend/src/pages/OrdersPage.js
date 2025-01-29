import React, { useState, useEffect } from "react";
import { getUserOrders, updateOrderStatus } from "../api";
import "../styles/OrdersPage.css";

function OrdersPage({ userId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getUserOrders(userId);
        setOrders(data);
      } catch (error) {
        console.error("Błąd pobierania zamówień:", error);
      }
    }
    fetchOrders();
  }, [userId]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Błąd zmiany statusu:", error);
    }
  };

  return (
    <div className="orders-container">
      <h2>Moje Zamówienia</h2>
      {orders.length === 0 ? (
        <p>Brak zamówień</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              Zamówienie #{order.id} - {order.address} - Status: {order.status}
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="status-select"
              >
                <option value="pending">Oczekujące</option>
                <option value="shipped">Wysłane</option>
                <option value="delivered">Dostarczone</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
