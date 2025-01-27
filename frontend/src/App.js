import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cookies from "js-cookie";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UsersListPage from "./pages/UsersListPage";
import UserEditPage from "./pages/UserEditPage";
import AddMedicationPage from "./pages/AddMedicationPage";
import CartPage from "./pages/CartPage";

const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-1; path=/;`;
};

function App() {
  const [token, setToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const savedToken = Cookies.get("jwtToken");
    if (savedToken) {
      setToken(savedToken);
    } else {
      setErrorMsg("Brak tokena autoryzacji, zaloguj się ponownie.");
    }
  }, []);

  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
    Cookies.set("jwtToken", receivedToken, { expires: 1 });
  };

  const handleLogout = () => {
    deleteCookie("jwtToken");
    setToken("");
    window.location.href = "/logowanie";
  };

  return (
    <BrowserRouter>
      <div style={{ margin: "20px" }}>
        <nav>
          <Link to="/" style={{ marginRight: "10px" }}>
            Strona główna
          </Link>
          <Link to="/rejestracja" style={{ marginRight: "10px" }}>
            Rejestracja
          </Link>
          <Link to="/logowanie" style={{ marginRight: "10px" }}>
            Logowanie
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

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <Routes>
          <Route path="/" element={<HomePage token={token} userId={1} />} />

          <Route path="/rejestracja" element={<RegisterPage />} />
          <Route
            path="/logowanie"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
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
