import React, { useEffect, useState } from "react";
import { getMedications } from "../api";

function HomePage() {
  const [medications, setMedications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await getMedications();
        setMedications(data);
      } catch (error) {
        setErrorMsg("Nie udało się załadować listy leków.");
      }
    };

    fetchMedications();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h2>Lista produktów</h2>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <ul>
        {medications.length > 0 ? (
          medications.map((med) => (
            <li key={med.id}>
              <strong>{med.name}</strong> - {med.description} <br />
              Cena: {med.price} PLN, Dostępność: {med.stock_quantity} szt.
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
