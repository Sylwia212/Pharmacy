import React, { useState, useEffect } from "react";
import { getUserOrders } from "../api";

function OrdersPage({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!userId) {
        return;
      }

      try {
        const response = await getUserOrders(userId);
        setOrders(response);
      } catch (error) {
        console.error("Błąd pobierania zamówień:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  if (loading)
    return <p>🔒 Musisz być zalogowany, aby zobaczyć historię zamówień!</p>;

  return (
    <div>
      <h2>📋 Moje zamówienia</h2>
      {orders.length === 0 ? (
        <p>Brak zamówień.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                marginBottom: "15px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <h3>📦 Zamówienie #{order.id}</h3>
              <p>
                <strong>Adres:</strong> {order.address}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <h4>📦 Pozycje w zamówieniu:</h4>
              <ul>
                {order.OrderItems.map((item) => (
                  <li key={item.id}>
                    {item.Medication.name} - {item.quantity} szt. (Cena:{" "}
                    {item.Medication.price} PLN)
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
