import React, { useEffect, useState } from "react";
import { getMedications, addToCart } from "../api";

function HomePage({ userId, token }) {
  const [medications, setMedications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

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

    try {
      await addToCart(userId, medicationId, 1);
      alert("Dodano do koszyka!");
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
          medications.map((med) => (
            <li key={med.id}>
              <strong>{med.name}</strong> - {med.description}
              <br />
              Cena: {med.price} PLN, Dostępność: {med.stock_quantity} szt.
              <br />
              {med.imageUrl && (
                <img
                  src={`http://localhost:3000${med.imageUrl}`}
                  alt={med.name}
                  width="150"
                />
              )}
              <button onClick={() => handleAddToCart(med.id)}>
                Dodaj do koszyka
              </button>
            </li>
          ))
        ) : (
          <p>Brak dostępnych leków.</p>
        )}
      </ul>
    </div>
  );
}

export default HomePage;
