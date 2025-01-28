import React, { useState, useEffect } from "react";
import { getCart, removeFromCart } from "../api";
import { useNavigate } from "react-router-dom";

function CartPage({ userId }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      try {
        const items = await getCart(userId);
        setCartItems(items);
      } catch (error) {
        console.error("Błąd pobierania koszyka:", error);
      }
    }
    fetchCart();
  }, [userId]);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }
    navigate("/order", { state: { cartItems } });
  };

  return (
    <div>
      <h2>Koszyk</h2>
      {cartItems.length === 0 ? (
        <p>Brak produktów w koszyku.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.Medication.name} - {item.quantity} szt.
              <button onClick={() => handleRemove(item.id)}>Usuń</button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <button onClick={handlePlaceOrder}>Złóż zamówienie</button>
      )}
    </div>
  );
}

export default CartPage;
