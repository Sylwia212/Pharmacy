import React, { useState } from "react";
import { loginUser } from "../api";
import Cookies from "js-cookie";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      if (response.token) {
        Cookies.set("jwtToken", response.token, { expires: 1 }); 
        onLoginSuccess(response.token);
        alert("Logowanie zakończone sukcesem!");
        window.location.href = "/";
      } else {
        alert("Błąd logowania. Sprawdź swoje dane.");
      }
    } catch (error) {
      alert("Wystąpił problem podczas logowania.");
      console.error("Błąd logowania:", error);
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
