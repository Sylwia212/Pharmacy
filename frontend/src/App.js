import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SecretPage from "./pages/SecretPage";
import UsersListPage from "./pages/UsersListPage";
import UserEditPage from "./pages/UserEditPage";
import AddMedicationPage from "./pages/AddMedicationPage";
import CartPage from "./pages/CartPage";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
    localStorage.setItem("jwtToken", receivedToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("jwtToken");
  };

  return (
    <BrowserRouter>
      <div style={{ margin: "20px" }}>
        <nav
          style={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          <Link to="/" style={{ marginRight: "10px" }}>
            Strona główna
          </Link>
          <Link to="/rejestracja" style={{ marginRight: "10px" }}>
            Rejestracja
          </Link>
          <Link to="/logowanie" style={{ marginRight: "10px" }}>
            Logowanie
          </Link>
          <Link to="/secret" style={{ marginRight: "10px" }}>
            Tajne dane
          </Link>
          <Link to="/users" style={{ marginRight: "10px" }}>
            Użytkownicy
          </Link>
          <Link to="/dodaj" style={{ marginRight: "10px" }}>
            Dodaj lek
          </Link>
          <Link to="/koszyk" style={{ marginRight: "10px" }}>
            Koszyk
          </Link>
          {token && <button onClick={handleLogout}>Wyloguj</button>}
        </nav>

        <Routes>
          <Route path="/" element={<HomePage userId={1}/>} />
          <Route path="/rejestracja" element={<RegisterPage />} />
          <Route
            path="/logowanie"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/secret" element={<SecretPage token={token} />} />
          <Route path="/users" element={<UsersListPage token={token} />} />
          <Route
            path="/users/edit/:id"
            element={<UserEditPage token={token} />}
          />
          <Route path="/dodaj" element={<AddMedicationPage />} />
          <Route path="/koszyk" element={<CartPage userId={1} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
