import React, { useState } from "react";
import { getSecretData } from "../api";

function SecretPage({ token }) {
  const [secretMsg, setSecretMsg] = useState("");

  const handleFetchSecret = async () => {
    if (!token) {
      setSecretMsg("Brak tokena – zaloguj się najpierw.");
      return;
    }

    let message = `Twój token: ${token}`;
    const data = await getSecretData(token);

    if (data.message) {
      message += `\nWiadomość od serwera: ${data.message}`;
    } else if (data.error) {
      message += `\nBłąd: ${data.error}`;
    } else {
      message += `\nBrak wiadomości w odpowiedzi.`;
    }

    setSecretMsg(message);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Tajne dane</h2>
      <button onClick={handleFetchSecret}>Pobierz dane chronione</button>
      <p style={{ whiteSpace: "pre-wrap" }}>{secretMsg}</p>
    </div>
  );
}

export default SecretPage;
