import React, { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../api";

function CartPage({ userId }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      try {
        const items = await getCart(userId);
        console.log("Produkty w koszyku:", items);
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

  return (
    <div>
      <h2>Koszyk</h2>
      {Array.isArray(cartItems) && cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.Medication?.name || "Nieznany lek"} - {item.quantity} szt.
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
