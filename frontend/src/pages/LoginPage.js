import React, { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser(email, password);

      if (response.token) {
        onLoginSuccess(response.token);
        alert("Zalogowano pomyślnie!");
        navigate("/");
      } else {
        alert("Niepoprawne dane!");
        setError("Nieprawidłowe dane logowania.");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas logowania.");
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
