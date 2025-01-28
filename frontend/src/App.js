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

function App() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const parseJwt = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error("Błąd dekodowania tokena JWT:", e);
      return null;
    }
  };

  useEffect(() => {
    const savedToken = Cookies.get("jwtToken");
    if (savedToken) {
      setToken(savedToken);
      const decoded = parseJwt(savedToken);
      setUserId(decoded?.userId || null);
    } else {
      setErrorMsg("Brak tokena autoryzacji, zaloguj się ponownie.");
    }
  }, []);

  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
    Cookies.set("authToken", receivedToken, { expires: 1 });
    const decoded = parseJwt(receivedToken);
    setUserId(decoded?.userId || null);
  };

  const handleLogout = async () => {
    console.log("Wylogowywanie...");

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
    console.log("Wylogowano pomyślnie, token usunięty!");
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
          <Route path="/koszyk" element={<CartPage userId={userId} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
