import React, { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../api";

function CartPage({ userId }) {
  const [cartItems, setCartItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchCart() {
      try {
        const items = await getCart(userId);
        setCartItems(items);
      } catch (error) {
        setErrorMsg("Błąd podczas pobierania koszyka.");
      }
    }
    fetchCart();
  }, [userId]);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2>Koszyk</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.Medication.name} - {item.quantity} szt.
              <button onClick={() => handleRemove(item.id)}>Usuń</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Koszyk jest pusty.</p>
      )}
    </div>
  );
}

export default CartPage;
