import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import Register from "./pages/Register";
import MyReservations from "./pages/MyReservations";
import "./App.css";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-state"><div className="loading-spinner"></div></div>;
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<ProtectedRoute><Restaurants /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><Register /></ProtectedRoute>} />
        <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
        <Route path="/my-reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
