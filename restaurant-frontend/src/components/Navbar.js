import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/");
  };

  // Don't show navbar on login page
  if (location.pathname === "/") return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/register")}>
        <span className="brand-icon">🍽️</span>
        <span className="brand-name">TableTrek</span>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li>
          <button
            className={`nav-btn ${location.pathname === "/register" ? "active" : ""}`}
            onClick={() => { navigate("/register"); setMenuOpen(false); }}
          >
            <i className="fas fa-calendar-plus"></i> Book Table
          </button>
        </li>
        <li>
          <button
            className={`nav-btn ${location.pathname === "/my-reservations" ? "active" : ""}`}
            onClick={() => { navigate("/my-reservations"); setMenuOpen(false); }}
          >
            <i className="fas fa-list-alt"></i> My Reservations
          </button>
        </li>
        {username && (
          <li className="nav-user">
            <span className="user-greeting">
              <i className="fas fa-user-circle"></i> {username}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
