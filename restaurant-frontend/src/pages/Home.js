import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles.css";

function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a username.");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter a password.");
      return;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    // Simulate auth delay (replace with real API call if backend has auth)
    setTimeout(() => {
      localStorage.setItem("username", username.trim());
      toast.success(`Welcome back, ${username.trim()}! 🎉`);
      setLoading(false);
      navigate("/register");
    }, 800);
  };

  return (
    <div className="login-page">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-brand">
          <span className="login-brand-icon">🍽️</span>
          <h1>TableTrek</h1>
          <p>Your perfect dining experience starts here</p>
        </div>
        <div className="login-features">
          <div className="feature-item">
            <i className="fas fa-calendar-check"></i>
            <span>Instant Table Booking</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-clock"></i>
            <span>Real-time Availability</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-star"></i>
            <span>Special Requests Handled</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-bell"></i>
            <span>Reservation Reminders</span>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to manage your reservations</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i> Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i> Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              <i className="fas fa-shield-alt"></i> Your data is safe with us
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
