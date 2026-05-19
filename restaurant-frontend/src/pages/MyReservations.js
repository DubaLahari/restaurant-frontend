import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./styles.css";

const API_BASE = process.env.REACT_APP_API_URL || "https://restaurant-backend-haaa.onrender.com";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const username = localStorage.getItem("username");

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/reservations`);
      // Support both { data: [...] } and plain array responses
      const raw = Array.isArray(res.data) ? res.data : (res.data.data || []);
      const userReservations = raw.filter(
        (r) => !r.username || r.username === username
      );
      setReservations(userReservations.reverse());
    } catch {
      toast.error("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE}/api/reservations/${id}`);
      toast.success("Reservation cancelled successfully.");
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Failed to cancel reservation.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (date) => {
    const reservationDate = new Date(date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) return { label: "Completed", cls: "status-completed" };
    if (reservationDate.toDateString() === today.toDateString()) return { label: "Today", cls: "status-today" };
    return { label: "Upcoming", cls: "status-upcoming" };
  };

  const filtered = reservations.filter((r) => {
    const matchSearch =
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.includes(searchTerm) ||
      r.date?.includes(searchTerm);

    if (filterStatus === "all") return matchSearch;
    const status = getStatusBadge(r.date).label.toLowerCase();
    return matchSearch && status === filterStatus;
  });

  return (
    <div className="page-wrapper">
      <div className="reservations-container">
        <div className="reservations-header">
          <div>
            <h2>
              <i className="fas fa-list-alt"></i> My Reservations
            </h2>
            <p>Manage all your table bookings in one place</p>
          </div>
          <button className="refresh-btn" onClick={fetchReservations} title="Refresh">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="reservations-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, phone, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {["all", "upcoming", "today", "completed"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filterStatus === f ? "active" : ""}`}
                onClick={() => setFilterStatus(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your reservations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h3>No reservations found</h3>
            <p>
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter."
                : "You haven't made any reservations yet."}
            </p>
          </div>
        ) : (
          <>
            <p className="results-count">
              Showing <strong>{filtered.length}</strong> reservation{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="reservations-grid">
              {filtered.map((r) => {
                const status = getStatusBadge(r.date);
                return (
                  <div key={r._id} className={`reservation-card ${status.cls}`}>
                    <div className="card-top">
                      <div className="card-name">
                        <i className="fas fa-user-circle"></i>
                        <span>{r.name}</span>
                      </div>
                      <span className={`status-badge ${status.cls}`}>{status.label}</span>
                    </div>

                    <div className="card-details">
                      <div className="detail-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>
                          {new Date(r.date + "T00:00:00").toLocaleDateString("en-IN", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{r.time}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-users"></i>
                        <span>{r.people} Guest{Number(r.people) > 1 ? "s" : ""}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-phone"></i>
                        <span>{r.phone}</span>
                      </div>
                      {r.tableType && (
                        <div className="detail-item">
                          <i className="fas fa-chair"></i>
                          <span>
                            {r.tableType === "indoor" ? "🏠" : r.tableType === "outdoor" ? "🌿" : "🔒"}{" "}
                            {r.tableType.charAt(0).toUpperCase() + r.tableType.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {r.specialRequest && (
                      <div className="card-request">
                        <i className="fas fa-comment-dots"></i>
                        <span>{r.specialRequest}</span>
                      </div>
                    )}

                    {status.label !== "Completed" && (
                      <button
                        className="cancel-btn"
                        onClick={() => handleDelete(r._id)}
                        disabled={deletingId === r._id}
                      >
                        {deletingId === r._id ? (
                          <>
                            <span className="spinner"></span> Cancelling...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times-circle"></i> Cancel Reservation
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyReservations;
