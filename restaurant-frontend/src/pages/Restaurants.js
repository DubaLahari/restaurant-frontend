import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles.css";

const API_BASE = "http://localhost:5001";

function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("All");

  const cuisines = ["All", "Indian", "Italian", "Chinese", "American", "Japanese", "North Indian"];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/restaurants`);
      setRestaurants(res.data);
    } catch {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    const matchCuisine = filterCuisine === "All" || r.cuisine === filterCuisine;
    return matchSearch && matchCuisine;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fas fa-star ${i < Math.floor(rating) ? "star-filled" : i < rating ? "star-half" : "star-empty"}`}></i>
    ));
  };

  return (
    <div className="page-wrapper">
      <div className="restaurants-page">
        <div className="restaurants-hero">
          <h1>🍽️ Find Your Perfect Restaurant</h1>
          <p>Browse top restaurants and book your table instantly</p>
          <div className="hero-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search by name or location..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="cuisine-filters">
          {cuisines.map((c) => (
            <button key={c}
              className={`cuisine-btn ${filterCuisine === c ? "active" : ""}`}
              onClick={() => setFilterCuisine(c)}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading restaurants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🍽️</span>
            <h3>No restaurants found</h3>
            <p>Try a different search or cuisine filter</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            {filtered.map((r) => (
              <div key={r._id} className="restaurant-card"
                onClick={() => navigate(`/book/${r._id}`, { state: { restaurant: r } })}>
                <div className="restaurant-img">
                  <img src={r.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
                    alt={r.name} onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";
                    }} />
                  <span className="price-badge">{r.priceRange}</span>
                </div>
                <div className="restaurant-info">
                  <h3>{r.name}</h3>
                  <p className="cuisine-tag"><i className="fas fa-utensils"></i> {r.cuisine}</p>
                  <p className="location-tag"><i className="fas fa-map-marker-alt"></i> {r.location}</p>
                  <div className="rating-row">
                    <div className="stars">{renderStars(r.rating)}</div>
                    <span className="rating-num">{r.rating}</span>
                  </div>
                  <p className="restaurant-desc">{r.description}</p>
                  <div className="restaurant-footer">
                    <span><i className="fas fa-clock"></i> {r.openTime} - {r.closeTime}</span>
                    <button className="book-now-btn"
                      onClick={(e) => { e.stopPropagation(); navigate(`/book/${r._id}`, { state: { restaurant: r } }); }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurants;
