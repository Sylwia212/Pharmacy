import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api";
import { Link } from "react-router-dom";

function UsersListPage({ token }) {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        setErrorMsg(error.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setErrorMsg("Musisz się zalogować, aby zobaczyć użytkowników.");
        setLoading(false);
        return;
      }
      try {
        const usersData = await getAllUsers(token);
        setUsers(usersData);
      } catch (error) {
        console.error("Błąd podczas pobierania użytkowników:", error);
        setErrorMsg(`Błąd pobierania danych: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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
