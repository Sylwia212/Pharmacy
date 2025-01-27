import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../api";

function UserEditPage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [responseMsg, setResponseMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setResponseMsg("Brak autoryzacji. Zaloguj się.");
          return;
        }
        const userData = await getUserById(id, token);
        setLoading(false);
      } catch (err) {
        setResponseMsg("Błąd przy pobieraniu użytkownika.");
        setLoading(false);
      }
    };
    loadUser();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setResponseMsg("Hasła nie są zgodne.");
      return;
    }

    try {
      if (!token) {
        setResponseMsg("Brak autoryzacji.");
        return;
      }
      await updateUser(id, { password }, token);
      setResponseMsg("Hasło zostało zmienione pomyślnie!");
      setTimeout(() => {
        navigate("/users");
      }, 1000);
    } catch (err) {
      setResponseMsg("Błąd podczas zmiany hasła.");
    }
  };

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h2>Zmiana hasła dla użytkownika (ID: {id})</h2>
      {responseMsg && (
        <p style={{ color: responseMsg.includes("Błąd") ? "red" : "green" }}>
          {responseMsg}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nowe hasło: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Potwierdź hasło: </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zmień hasło</button>
      </form>
    </div>
  );
}

export default UserEditPage;
