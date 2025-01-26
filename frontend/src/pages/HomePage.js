import React, { useEffect, useState } from "react";
import { getMedications, deleteMedication, addToCart } from "../api";

function HomePage({ userId }) {
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

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten lek?")) {
      await deleteMedication(id);
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const handleAddToCart = async (medicationId) => {
    await addToCart(userId, medicationId, 1);
    alert("Dodano do koszyka!");
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
              <br />
              <button onClick={() => handleDelete(med.id)}>Usuń</button>
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
