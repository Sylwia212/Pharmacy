import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../api";

function UserEditPage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [responseMsg, setResponseMsg] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setResponseMsg("Brak autoryzacji. Zaloguj się.");
          return;
        }
        const userData = await getUserById(id, token);
        setEmail(userData.email);
        setRole(userData.role);
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
    try {
      if (!token) {
        setResponseMsg("Brak autoryzacji.");
        return;
      }
      await updateUser(id, { email, role }, token);
      setResponseMsg("Zaktualizowano pomyślnie!");
      setTimeout(() => {
        navigate("/users");
      }, 1000);
    } catch (err) {
      setResponseMsg("Błąd podczas aktualizacji użytkownika.");
    }
  };

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h2>Edycja użytkownika (ID: {id})</h2>
      {responseMsg && <p>{responseMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Rola: </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <button type="submit">Zapisz</button>
      </form>
    </div>
  );
}

export default UserEditPage;
