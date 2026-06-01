import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname === "/") return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/restaurants")}>
        <span className="brand-icon">🍽️</span>
        <span className="brand-name">TableTrek</span>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li>
          <button className={`nav-btn ${location.pathname === "/restaurants" ? "active" : ""}`}
            onClick={() => { navigate("/restaurants"); setMenuOpen(false); }}>
            <i className="fas fa-store"></i> Restaurants
          </button>
        </li>
        <li>
          <button className={`nav-btn ${location.pathname === "/my-reservations" ? "active" : ""}`}
            onClick={() => { navigate("/my-reservations"); setMenuOpen(false); }}>
            <i className="fas fa-list-alt"></i> My Reservations
          </button>
        </li>
        {user && (
          <li className="nav-user">
            <span className="user-greeting">
              <i className="fas fa-user-circle"></i> {user.username}
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
