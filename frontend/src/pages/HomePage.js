import React, { useEffect, useState } from "react";
import { getMedications, addToCart, searchMedicationByName } from "../api";
import { useUserWebSocket } from "../context/userWebSocket";
import "../styles/HomePage.css";

function HomePage({ userId, token }) {
  const [medications, setMedications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [smedications, setSmedications] = useState([]);
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

  const handleSearch = async () => {
    try {
      const results = await searchMedicationByName(searchTerm);
      setSmedications(results);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg("Błąd podczas wyszukiwania leków.");
    }
  };

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
    <div className="page-container">
      <h2>Lista leków</h2>
      <div className="search-container">
        <h2>Wyszukiwanie leku</h2>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Podaj nazwę leku"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Szukaj
          </button>
        </div>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <ul className="search-results-list">
          {smedications.map((med) => (
            <li key={med.id} className="search-result-item">
              <span className="result-name">{med.name}</span>
              <span className="result-price">{med.price} PLN</span>
            </li>
          ))}
        </ul>
      </div>

      {errorMsg && <p className="error-message">{errorMsg}</p>}

      <ul className="medications-list">
        {medications.length > 0 ? (
          medications.map((med) => {
            const availableStock = stockUpdates?.[med.id] ?? med.stock_quantity;
            const cartQuantity = cart[med.id] || 0;

            const isOutOfStock = availableStock === 0;
            const isMaxInCart = cartQuantity >= availableStock;

            return (
              <li key={med.id} className="medication-item">
                <strong className="medication-name">{med.name}</strong>
                <img
                  src={`http://localhost:3000${med.imageUrl}`}
                  alt={med.name}
                  className="medication-img"
                />
                <p className="medication-description">{med.description}</p>
                <p className="medication-price">Cena: {med.price} PLN</p>
                <button
                  onClick={() => handleAddToCart(med.id)}
                  className="add-to-cart-btn"
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
