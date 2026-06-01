import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./styles.css";

function Home() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "", email: "", password: "", phone: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }
    if (!isLogin && !form.username) {
      toast.error("Username is required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success("Welcome back! 🎉");
      } else {
        await register(form.username, form.email, form.password, form.phone);
        toast.success("Account created! Welcome 🎉");
      }
      navigate("/restaurants");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <span className="login-brand-icon">🍽️</span>
          <h1>TableTrek</h1>
          <p>Your perfect dining experience starts here</p>
        </div>
        <div className="login-features">
          <div className="feature-item"><i className="fas fa-utensils"></i><span>Browse Top Restaurants</span></div>
          <div className="feature-item"><i className="fas fa-calendar-check"></i><span>Instant Table Booking</span></div>
          <div className="feature-item"><i className="fas fa-star"></i><span>Special Requests Handled</span></div>
          <div className="feature-item"><i className="fas fa-list-alt"></i><span>Manage Your Reservations</span></div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>Login</button>
            <button className={`auth-tab ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>

          <div className="login-header">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p>{isLogin ? "Sign in to manage your reservations" : "Join TableTrek today"}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="input-group">
                <label><i className="fas fa-user"></i> Username</label>
                <input name="username" type="text" placeholder="Choose a username"
                  value={form.username} onChange={handleChange} />
              </div>
            )}
            <div className="input-group">
              <label><i className="fas fa-envelope"></i> Email</label>
              <input name="email" type="email" placeholder="Enter your email"
                value={form.email} onChange={handleChange} autoComplete="email" />
            </div>
            {!isLogin && (
              <div className="input-group">
                <label><i className="fas fa-phone"></i> Phone (optional)</label>
                <input name="phone" type="text" placeholder="10-digit phone number"
                  value={form.phone} onChange={handleChange} maxLength={10} />
              </div>
            )}
            <div className="input-group">
              <label><i className="fas fa-lock"></i> Password</label>
              <div className="password-wrapper">
                <input name="password" type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Min 6 characters"}
                  value={form.password} onChange={handleChange} autoComplete={isLogin ? "current-password" : "new-password"} />
                <button type="button" className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}>
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <><span className="spinner"></span> Please wait...</> :
                <><i className={`fas fa-${isLogin ? "sign-in-alt" : "user-plus"}`}></i> {isLogin ? "Sign In" : "Create Account"}</>}
            </button>
          </form>

          <div className="login-footer">
            <p><i className="fas fa-shield-alt"></i> Your data is safe with us</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
