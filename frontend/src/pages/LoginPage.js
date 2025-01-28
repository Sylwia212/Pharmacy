import React, { useState } from "react";
import { loginUser } from "../api"; 

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password);
      if (response.token) {
        document.cookie = `jwtToken=${response.token}; path=/; max-age=86400`; 
        onLoginSuccess(response.token); 
      } else {
        alert("Błąd logowania: Niepoprawne dane.");
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
      alert("Wystąpił problem podczas logowania.");
    }
  };

  return (
    <div>
      <h2>Logowanie</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}

export default LoginPage;
