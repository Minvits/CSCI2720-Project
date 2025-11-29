import React from 'react';
import '../styles/components.css';

function LocationCard({ location }) {
  return (
    <div className="location-card">
      <h3>{location.name}</h3>
      <p className="venue-id">📍 {location.venueId}</p>
      <p className="event-count">🎭 {location.eventCount} events</p>
      <div className="location-coords">
        <small>📌 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</small>
      </div>
      <p className="updated-at">Last updated: {new Date(location.lastUpdated).toLocaleDateString()}</p>
    </div>
  );
}

export default LocationCard;