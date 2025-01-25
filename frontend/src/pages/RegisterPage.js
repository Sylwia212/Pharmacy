import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const data = await registerUser(email, password);
    if (data.id) {
      setEmail("");
      setPassword("");

      setResponseMsg(`Pomyślnie zarejestrowano użytkownika ID: ${data.id}`);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else if (data.message) {
      setResponseMsg(`Błąd: ${data.message}`);
    } else {
      setResponseMsg("Nieznany błąd");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hasło: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zarejestruj</button>
      </form>
      {responseMsg && <p>{responseMsg}</p>}
    </div>
  );
}

export default RegisterPage;
