import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_BASE = "http://localhost:5001";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("username", u.username);
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (username, email, password, phone) => {
    const res = await axios.post(`${API_BASE}/api/auth/register`, {
      username, email, password, phone,
    });
    const { token: t, user: u } = res.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("username", u.username);
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
