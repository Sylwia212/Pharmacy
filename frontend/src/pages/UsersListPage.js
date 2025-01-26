import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api";
import { Link } from "react-router-dom";

function UsersListPage({ token }) {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getAllUsers(token)
        .then((data) => {
          if (data.message) {
            setErrorMsg(data.message);
          } else {
            setUsers(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          setErrorMsg("Błąd pobierania danych.");
          setLoading(false);
        });
    } else {
      setErrorMsg("Musisz się zalogować, aby zobaczyć użytkowników.");
      setLoading(false);
    }
  }, [token]);

  const handleDelete = async (userId) => {
    if (!token) return;
    if (window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      try {
        await deleteUser(userId, token);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        setErrorMsg("Błąd podczas usuwania użytkownika.");
      }
    }
  };

  if (!token)
    return <p>Musisz być zalogowany, aby zobaczyć listę użytkowników.</p>;

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div>
      <h2>Lista użytkowników</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.email} ({u.role})
            <Link to={`/users/edit/${u.id}`} style={{ marginLeft: "10px" }}>
              Edytuj
            </Link>
            <button
              onClick={() => handleDelete(u.id)}
              style={{ marginLeft: "10px" }}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersListPage;
