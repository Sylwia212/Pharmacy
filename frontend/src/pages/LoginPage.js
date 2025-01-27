import React, { useState } from "react";
import { loginUser } from "../api";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);

      if (response.message === "Zalogowano pomyślnie") {
        onLoginSuccess();
        window.location.href = "/";
      } else {
        setError("Błąd logowania. Sprawdź dane.");
      }
    } catch (err) {
      setError("Wystąpił błąd serwera.");
    }
  };

  return (
    <div>
      <h2>Logowanie</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}

export default LoginPage;
