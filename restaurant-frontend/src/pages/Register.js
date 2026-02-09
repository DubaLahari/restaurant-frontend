// client/src/pages/Register.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    people: "",
    specialRequest: ""
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    setUsername(savedUser || "User");
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://restaurant-backend-haaa.onrender.com/api/reservations", {
  ...formData,
  people: Number(formData.people)
});

      alert("🎉 Reservation Successful!");
      setFormData({ name: "", phone: "", date: "", time: "", people: "", specialRequest: "" });
    } catch {
      alert("❌ Error in registration");
    }
  };

  return (
    <div className="page-container">
      <div className="form-card register-grid">
        <div className="left-fields">
          <h2 className="welcome">👋 Welcome, {username}!</h2>
          <h3>Book Your Table</h3>
          <input name="name" placeholder="Name" onChange={handleChange} value={formData.name} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} value={formData.phone} />
          <input name="date" type="date" onChange={handleChange} value={formData.date} />
          <input name="time" type="time" onChange={handleChange} value={formData.time} />
          <input name="people" placeholder="No. of People" onChange={handleChange} value={formData.people} />
          <button onClick={handleSubmit}>Register</button>
        </div>
        <div className="right-request">
          <label>Special Requests</label>
          <textarea name="specialRequest" placeholder="Write here..." onChange={handleChange} value={formData.specialRequest}></textarea>
        </div>
      </div>
    </div>
  );
}

export default Register;
