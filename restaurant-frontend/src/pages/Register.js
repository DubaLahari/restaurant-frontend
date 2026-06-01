import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles.css";

const API_BASE = "http://localhost:5001";

const TIME_SLOTS = [
  "11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","18:00","18:30","19:00","19:30",
  "20:00","20:30","21:00","21:30","22:00",
];

function Register() {
  const navigate = useNavigate();
  const { id: restaurantId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const restaurant = location.state?.restaurant;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "", phone: "", date: "", time: "",
    people: "", specialRequest: "", tableType: "indoor",
  });

  useEffect(() => {
    if (user) setFormData((prev) => ({ ...prev, name: user.username || "" }));
  }, [user]);

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/[\s\-]/g, ""))) e.phone = "Enter a valid 10-digit phone number";
    if (!formData.date) e.date = "Please select a date";
    if (!formData.time) e.time = "Please select a time slot";
    if (!formData.people) e.people = "Number of guests is required";
    else if (Number(formData.people) < 1 || Number(formData.people) > 20) e.people = "Guests must be between 1 and 20";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
      await axios.post(`${API_BASE}/api/reservations`, {
        ...formData,
        phone: formData.phone.replace(/[\s\-]/g, ""),
        people: Number(formData.people),
        username: user?.username || "",
        userId: user?.id || null,
        restaurantId: restaurantId || null,
        restaurantName: restaurant?.name || "",
      });
      toast.success("🎉 Table booked successfully!");
      setFormData({ name: user?.username || "", phone: "", date: "", time: "", people: "", specialRequest: "", tableType: "indoor" });
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed. Please try again.";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="booking-container">
        <div className="booking-header">
          {restaurant && (
            <div className="selected-restaurant">
              <img src={restaurant.image} alt={restaurant.name}
                onError={(e) => { e.target.style.display = "none"; }} />
              <div>
                <span className="selected-label">Booking at</span>
                <h3>{restaurant.name}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {restaurant.location} &nbsp;|&nbsp; <i className="fas fa-utensils"></i> {restaurant.cuisine}</p>
              </div>
            </div>
          )}
          <h2><i className="fas fa-calendar-plus"></i> Book Your Table</h2>
          <p>Welcome, <strong>{user?.username}</strong>! Fill in the details below.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="booking-grid">
            <div className="booking-left">
              <div className={`field-group ${errors.name ? "has-error" : ""}`}>
                <label><i className="fas fa-user"></i> Full Name</label>
                <input name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>
              <div className={`field-group ${errors.phone ? "has-error" : ""}`}>
                <label><i className="fas fa-phone"></i> Phone Number</label>
                <input name="phone" placeholder="10-digit phone number" value={formData.phone} onChange={handleChange} maxLength={10} />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
              <div className={`field-group ${errors.date ? "has-error" : ""}`}>
                <label><i className="fas fa-calendar-alt"></i> Reservation Date</label>
                <input name="date" type="date" min={today} value={formData.date} onChange={handleChange} />
                {errors.date && <span className="error-msg">{errors.date}</span>}
              </div>
              <div className={`field-group ${errors.time ? "has-error" : ""}`}>
                <label><i className="fas fa-clock"></i> Time Slot</label>
                <div className="time-slots">
                  {TIME_SLOTS.map((slot) => (
                    <button key={slot} type="button"
                      className={`time-slot-btn ${formData.time === slot ? "selected" : ""}`}
                      onClick={() => { setFormData((p) => ({ ...p, time: slot })); if (errors.time) setErrors((p) => ({ ...p, time: "" })); }}>
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.time && <span className="error-msg">{errors.time}</span>}
              </div>
              <div className={`field-group ${errors.people ? "has-error" : ""}`}>
                <label><i className="fas fa-users"></i> Number of Guests</label>
                <div className="guest-counter">
                  <button type="button" className="counter-btn"
                    onClick={() => setFormData((p) => ({ ...p, people: Math.max(1, Number(p.people || 1) - 1).toString() }))}>
                    <i className="fas fa-minus"></i>
                  </button>
                  <input name="people" type="number" min="1" max="20" placeholder="0"
                    value={formData.people} onChange={handleChange} className="guest-input" />
                  <button type="button" className="counter-btn"
                    onClick={() => setFormData((p) => ({ ...p, people: Math.min(20, Number(p.people || 0) + 1).toString() }))}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {errors.people && <span className="error-msg">{errors.people}</span>}
              </div>
            </div>

            <div className="booking-right">
              <div className="field-group">
                <label><i className="fas fa-chair"></i> Seating Preference</label>
                <div className="table-type-options">
                  {["indoor", "outdoor", "private"].map((type) => (
                    <label key={type} className={`table-option ${formData.tableType === type ? "selected" : ""}`}>
                      <input type="radio" name="tableType" value={type} checked={formData.tableType === type} onChange={handleChange} />
                      <span className="table-icon">{type === "indoor" ? "🏠" : type === "outdoor" ? "🌿" : "🔒"}</span>
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field-group">
                <label><i className="fas fa-comment-dots"></i> Special Requests</label>
                <textarea name="specialRequest" rows={4}
                  placeholder="Allergies, celebrations, dietary needs..."
                  value={formData.specialRequest} onChange={handleChange}></textarea>
              </div>
              {(formData.date || formData.time || formData.people) && (
                <div className="booking-summary">
                  <h4><i className="fas fa-receipt"></i> Booking Summary</h4>
                  <ul>
                    {restaurant && <li><i className="fas fa-store"></i> {restaurant.name}</li>}
                    {formData.name && <li><i className="fas fa-user"></i> {formData.name}</li>}
                    {formData.date && <li><i className="fas fa-calendar"></i> {new Date(formData.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</li>}
                    {formData.time && <li><i className="fas fa-clock"></i> {formData.time}</li>}
                    {formData.people && <li><i className="fas fa-users"></i> {formData.people} Guest{Number(formData.people) > 1 ? "s" : ""}</li>}
                    <li><i className="fas fa-chair"></i> {formData.tableType.charAt(0).toUpperCase() + formData.tableType.slice(1)} Seating</li>
                  </ul>
                </div>
              )}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <><span className="spinner"></span> Booking...</> : <><i className="fas fa-check-circle"></i> Confirm Reservation</>}
              </button>
              <button type="button" className="view-reservations-btn" onClick={() => navigate("/my-reservations")}>
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
