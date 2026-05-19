import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const API_BASE = process.env.REACT_APP_API_URL || "https://restaurant-backend-haaa.onrender.com";

const TIME_SLOTS = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00"
];

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    people: "",
    specialRequest: "",
    tableType: "indoor"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    setUsername(savedUser || "Guest");
    // Pre-fill name from username
    setFormData((prev) => ({ ...prev, name: savedUser || "" }));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s\-]/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time slot";
    if (!formData.people) {
      newErrors.people = "Number of guests is required";
    } else if (Number(formData.people) < 1 || Number(formData.people) > 20) {
      newErrors.people = "Guests must be between 1 and 20";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      // Only send fields the original backend understands
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.replace(/[\s\-]/g, "").trim(),
        date: formData.date,
        time: formData.time,
        people: Number(formData.people),
        specialRequest: formData.specialRequest.trim(),
        tableType: formData.tableType,
        username,
      };

      const res = await axios.post(`${API_BASE}/api/reservations`, payload);
      console.log("Booking response:", res.data);
      toast.success("🎉 Table booked successfully!");
      setFormData({
        name: username,
        phone: "",
        date: "",
        time: "",
        people: "",
        specialRequest: "",
        tableType: "indoor",
      });
      setErrors({});
    } catch (err) {
      console.error("Booking error:", err.response || err.message);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.response?.status === 409
          ? "This time slot is already booked for your phone number."
          : err.response?.status === 0 || !err.response
          ? "Cannot reach the server. Check your internet connection."
          : "Booking failed. Please try again.");
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="booking-container">
        {/* Header */}
        <div className="booking-header">
          <h2>
            <i className="fas fa-utensils"></i> Book Your Table
          </h2>
          <p>
            Welcome, <strong>{username}</strong>! Fill in the details below to reserve your spot.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="booking-grid">
            {/* Left column */}
            <div className="booking-left">
              {/* Name */}
              <div className={`field-group ${errors.name ? "has-error" : ""}`}>
                <label>
                  <i className="fas fa-user"></i> Full Name
                </label>
                <input
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              {/* Phone */}
              <div className={`field-group ${errors.phone ? "has-error" : ""}`}>
                <label>
                  <i className="fas fa-phone"></i> Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>

              {/* Date */}
              <div className={`field-group ${errors.date ? "has-error" : ""}`}>
                <label>
                  <i className="fas fa-calendar-alt"></i> Reservation Date
                </label>
                <input
                  name="date"
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error-msg">{errors.date}</span>}
              </div>

              {/* Time Slots */}
              <div className={`field-group ${errors.time ? "has-error" : ""}`}>
                <label>
                  <i className="fas fa-clock"></i> Time Slot
                </label>
                <div className="time-slots">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`time-slot-btn ${formData.time === slot ? "selected" : ""}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, time: slot }));
                        if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.time && <span className="error-msg">{errors.time}</span>}
              </div>

              {/* Guests */}
              <div className={`field-group ${errors.people ? "has-error" : ""}`}>
                <label>
                  <i className="fas fa-users"></i> Number of Guests
                </label>
                <div className="guest-counter">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        people: Math.max(1, Number(prev.people || 1) - 1).toString()
                      }))
                    }
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    name="people"
                    type="number"
                    min="1"
                    max="20"
                    placeholder="0"
                    value={formData.people}
                    onChange={handleChange}
                    className="guest-input"
                  />
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        people: Math.min(20, Number(prev.people || 0) + 1).toString()
                      }))
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {errors.people && <span className="error-msg">{errors.people}</span>}
              </div>
            </div>

            {/* Right column */}
            <div className="booking-right">
              {/* Table Type */}
              <div className="field-group">
                <label>
                  <i className="fas fa-chair"></i> Seating Preference
                </label>
                <div className="table-type-options">
                  {["indoor", "outdoor", "private"].map((type) => (
                    <label key={type} className={`table-option ${formData.tableType === type ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="tableType"
                        value={type}
                        checked={formData.tableType === type}
                        onChange={handleChange}
                      />
                      <span className="table-icon">
                        {type === "indoor" ? "🏠" : type === "outdoor" ? "🌿" : "🔒"}
                      </span>
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="field-group">
                <label>
                  <i className="fas fa-comment-dots"></i> Special Requests
                </label>
                <textarea
                  name="specialRequest"
                  placeholder="Allergies, celebrations, dietary needs, accessibility requirements..."
                  value={formData.specialRequest}
                  onChange={handleChange}
                  rows={5}
                ></textarea>
              </div>

              {/* Booking Summary */}
              {(formData.date || formData.time || formData.people) && (
                <div className="booking-summary">
                  <h4>
                    <i className="fas fa-receipt"></i> Booking Summary
                  </h4>
                  <ul>
                    {formData.name && <li><i className="fas fa-user"></i> {formData.name}</li>}
                    {formData.date && <li><i className="fas fa-calendar"></i> {new Date(formData.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</li>}
                    {formData.time && <li><i className="fas fa-clock"></i> {formData.time}</li>}
                    {formData.people && <li><i className="fas fa-users"></i> {formData.people} Guest{Number(formData.people) > 1 ? "s" : ""}</li>}
                    {formData.tableType && <li><i className="fas fa-chair"></i> {formData.tableType.charAt(0).toUpperCase() + formData.tableType.slice(1)} Seating</li>}
                  </ul>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Booking...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle"></i> Confirm Reservation
                  </>
                )}
              </button>

              <button
                type="button"
                className="view-reservations-btn"
                onClick={() => navigate("/my-reservations")}
              >
                <i className="fas fa-list-alt"></i> View My Reservations
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
