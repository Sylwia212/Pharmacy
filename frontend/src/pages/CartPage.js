import React, { useState, useEffect } from "react";
import { getCart, removeFromCart, placeOrder, clearCart } from "../api";
import { useNavigate } from "react-router-dom";

function CartPage({ userId }) {
  const [cartItems, setCartItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      if (!userId) {
        return;
      }

      try {
        const items = await getCart(userId);
        setCartItems(items);
      } catch (error) {
        console.error("Błąd pobierania koszyka:", error);
      }
    }

    if (userId !== null && userId !== undefined) {
      fetchCart();
    }
  }, [userId]);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }
    setShowForm(true);
  };

  const handleConfirmOrder = async () => {
    if (!userId || !address.trim() || cartItems.length === 0) {
      alert("Brak wymaganych danych do zamówienia.");
      return;
    }

    try {
      await placeOrder(userId, address.trim(), cartItems);
      await clearCart(userId);
      alert("Zamówienie złożone!");
      setCartItems([]);
    } catch (error) {
      alert("Błąd podczas składania zamówienia.");
    }
  };

  return (
    <div className="cart-container">
      <h2>Koszyk</h2>
      {cartItems.length > 0 ? (
        <ul className="cart-items">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              {item.Medication.name} - {item.quantity} szt.
              <button
                onClick={() => handleRemove(item.id)}
                className="remove-btn"
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Koszyk jest pusty.</p>
      )}

      {cartItems.length > 0 && !showForm && (
        <button onClick={handlePlaceOrder} className="order-btn">
          Złóż zamówienie
        </button>
      )}

      {showForm && (
        <div className="address-form">
          <h3> Podaj adres wysyłki</h3>
          <input
            type="text"
            placeholder="Wpisz adres"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="address-input"
          />
          <button onClick={handleConfirmOrder} className="confirm-btn">
            Potwierdź zamówienie
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
