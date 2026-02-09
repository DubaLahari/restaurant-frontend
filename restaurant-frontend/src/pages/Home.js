// client/src/pages/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim()) {
      localStorage.setItem("username", username);
      navigate("/register");
    } else {
      alert("Please enter a username.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1 className="title">Welcome to TableTrek</h1>
        <p className="subtitle">Easy and fast table reservations</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="password" placeholder="Password" />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Home;
