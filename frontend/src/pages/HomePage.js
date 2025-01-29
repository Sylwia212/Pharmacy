import React, { useEffect, useState } from "react";
import { getMedications, addToCart } from "../api";
import { useUserWebSocket } from "../context/userWebSocket";

function HomePage({ userId, token }) {
  const [medications, setMedications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [cart, setCart] = useState({});
  const { stockUpdates } = useUserWebSocket();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await getMedications();
        setMedications(data);
      } catch (error) {
        setErrorMsg("Błąd podczas pobierania listy leków.");
      }
    };

    fetchMedications();
  }, []);

  const handleAddToCart = async (medicationId) => {
    if (!token || !userId) {
      alert("Musisz być zalogowany, aby dodać produkt do koszyka.");
      return;
    }
  
    const numericMedicationId = Number(medicationId);
    const medication = medications.find((m) => m.id === numericMedicationId);

    const availableStock =
      stockUpdates?.[numericMedicationId] ?? medication.stock_quantity;
    const cartQuantity = cart[numericMedicationId] || 0;
  
    if (availableStock === 0) {
      alert("Produkt jest wyprzedany!");
      return;
    }
  
    if (cartQuantity >= availableStock) {
      alert("Masz już maksymalną dostępną ilość tego leku w koszyku!");
      return;
    }
  
    try {
      await addToCart(userId, numericMedicationId, 1);
      alert("Dodano do koszyka!");
      setCart((prevCart) => ({
        ...prevCart,
        [numericMedicationId]: cartQuantity + 1,
      }));
    } catch (error) {
      alert("Wystąpił problem podczas dodawania do koszyka.");
    }
  };
  
  return (
    <div style={{ margin: "20px" }}>
      <h2>Lista leków</h2>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <ul>
        {medications.length > 0 ? (
          medications.map((med) => {
            const availableStock = stockUpdates?.[med.id] ?? med.stock_quantity;
            const cartQuantity = cart[med.id] || 0;

            const isOutOfStock = availableStock === 0;
            const isMaxInCart = cartQuantity >= availableStock;

            return (
              <li key={med.id}>
                <strong>{med.name}</strong> - {med.description}
                <br />
                Cena: {med.price} PLN | Dostępność: {availableStock} szt.
                <br />
                {med.imageUrl && (
                  <img
                    src={`http://localhost:3000${med.imageUrl}`}
                    alt={med.name}
                    width="150"
                  />
                )}
                <br />
                <button
                  onClick={() => handleAddToCart(med.id)}
                  disabled={isOutOfStock || isMaxInCart}
                >
                  {isOutOfStock
                    ? "Wyprzedane"
                    : isMaxInCart
                    ? "Maksymalna ilość w koszyku"
                    : "Dodaj do koszyka"}
                </button>
              </li>
            );
          })
        ) : (
          <p>Brak dostępnych leków.</p>
        )}
      </ul>
    </div>
  );
}

export default HomePage;
