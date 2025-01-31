import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { NotificationsProvider } from "./context/NotificationsContext";
import { UserWebSocketProvider } from "./context/userWebSocket";
import { ChatWebSocketProvider } from "./context/ChatWebSocket";
import "./styles/App.css";

import UserNotifications from "./pages/UserNotifications";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UsersListPage from "./pages/UsersListPage";
import UserEditPage from "./pages/UserEditPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import EditMedicationPage from "./pages/EditMedicationPage";
import MedicationList from "./pages/MedicationsList";
import NotificationsPage from "./pages/NotificationsPage";
import InventoryNotifications from "./pages/InventoryNotifications";

function App() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      return Number(storedUserId);
    }

    const newUserId = Math.floor(Math.random() * 1000000);
    localStorage.setItem("userId", newUserId);
    return newUserId;
  });

  const [errorMsg, setErrorMsg] = useState("");

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = Cookies.get("jwtToken");

    if (token) {
      const decoded = parseJwt(token);
      if (decoded?.userId) {
        setUserId(decoded.userId);
        localStorage.setItem("userId", decoded.userId);
      }
      setToken(token);
    }
  }, []);

  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);

    const decoded = parseJwt(receivedToken);
    if (decoded?.userId) {
      setUserId(decoded.userId);
      localStorage.setItem("userId", decoded.userId);
    }
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

    Cookies.remove("jwtToken");
    setToken("");
    localStorage.removeItem("userId");
    setUserId(Math.floor(Math.random() * 1000000));
    window.location.href = "/logowanie";
  };

  return (
    <BrowserRouter>
      <ChatWebSocketProvider>
        <UserWebSocketProvider>
          <NotificationsProvider userId={userId}>
            <div className="container">
              <nav className="navbar">
                <Link to="/">Strona główna</Link>
                <Link to="/rejestracja">Rejestracja</Link>
                <Link to="/logowanie">Logowanie</Link>
                <Link to="/users">Użytkownicy</Link>
                <Link to="/koszyk">Koszyk</Link>
                <Link to="/zamowienia">Zamówienia</Link>
                <Link to="/powiadomienia">Powiadomienia</Link>
                <Link to="/medications">Leki</Link>
                <Link to="/chat">Chat</Link>
                {token && <button onClick={handleLogout}>Wyloguj</button>}
              </nav>

              <div className="header">
                <h1>Panel Apteki</h1>
              </div>

              <div>
                <UserNotifications />
                <InventoryNotifications />
              </div>

              {errorMsg && <p className="error-message">{errorMsg}</p>}

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
                <Route
                  path="/koszyk"
                  element={
                    userId !== null ? (
                      <CartPage userId={userId} />
                    ) : (
                      <p className="error-message">
                        Musisz być zalogowany, aby zobaczyć swój koszyk!
                      </p>
                    )
                  }
                />
                <Route
                  path="/zamowienia"
                  element={<OrdersPage userId={userId} />}
                />
                <Route path="/medications" element={<MedicationList />} />
                <Route
                  path="/medications/edit/:id"
                  element={<EditMedicationPage />}
                />
                <Route
                  path="/powiadomienia"
                  element={
                    userId ? (
                      <NotificationsPage userId={userId} />
                    ) : (
                      <Navigate to="/logowanie" />
                    )
                  }
                />
                <Route path="/chat" element={<ChatPage />} />
              </Routes>
            </div>
          </NotificationsProvider>
        </UserWebSocketProvider>
      </ChatWebSocketProvider>
    </BrowserRouter>
  );
}

export default App;
