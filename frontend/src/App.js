import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UsersListPage from "./pages/UsersListPage";
import UserEditPage from "./pages/UserEditPage";
import AddMedicationPage from "./pages/AddMedicationPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return value;
    }
    return null;
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded?.userId) {
        setUserId(decoded.userId);
      }
    }
  }, []);

  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
    Cookies.set("authToken", receivedToken, { expires: 1 });
    const decoded = parseJwt(receivedToken);
    setUserId(decoded?.userId || null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Błąd podczas wylogowania:", error);
    }

    document.cookie =
      "jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure";
    Cookies.remove("jwtToken");
    setToken("");
    setUserId(null);
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
          <Link to="/zamowienia" style={{ marginRight: "10px" }}>
            Zamówienia
          </Link>

          {token && <button onClick={handleLogout}>Wyloguj</button>}
        </nav>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <Routes>
          <Route
            path="/"
            element={<HomePage token={token} userId={userId} />}
          />

          <Route path="/rejestracja" element={<RegisterPage />} />
          <Route
            path="/logowanie"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/users"
            element={
              token ? (
                <UsersListPage token={token} />
              ) : (
                <Navigate to="/logowanie" />
              )
            }
          />

          <Route
            path="/users/edit/:id"
            element={<UserEditPage token={token} />}
          />
          <Route path="/dodaj" element={<AddMedicationPage />} />
          <Route
            path="/koszyk"
            element={
              userId !== null ? (
                <CartPage userId={userId} />
              ) : (
                <p>🔒 Musisz być zalogowany, aby zobaczyć swój koszyk! </p>
              )
            }
          />
          <Route path="/zamowienia" element={<OrdersPage userId={userId} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
