import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SecretPage from "./pages/SecretPage";

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
          {token && <button onClick={handleLogout}>Wyloguj</button>}
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rejestracja" element={<RegisterPage />} />
          <Route
            path="/logowanie"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/secret" element={<SecretPage token={token} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
