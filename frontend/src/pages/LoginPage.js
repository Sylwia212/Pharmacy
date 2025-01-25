import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";


function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await loginUser(email, password);

    if (data.token) {
      setResponseMsg("Zalogowano pomyślnie!");
      onLoginSuccess(data.token);

      setEmail("");
      setPassword("");
      navigate("/");
    } else if (data.message) {
      setResponseMsg(`Błąd: ${data.message}`);
    } else {
      setResponseMsg("Nieznany błąd przy logowaniu");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Logowanie</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Zaloguj</button>
      </form>
      {responseMsg && <p>{responseMsg}</p>}
    </div>
  );
}

export default LoginPage;
