import React, { useState } from 'react';
import '../styles/components.css';

function FilterPanel({ locations, onFilter, userLat, userLng, onUserLocationChange }) {
  const [keyword, setKeyword] = useState('');
  const [distance, setDistance] = useState('');

  const handleFilter = () => {
    let filtered = locations;

    // Filter by keyword
    if (keyword) {
      filtered = filtered.filter(loc =>
        loc.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Filter by distance
    if (distance) {
      const maxDist = parseFloat(distance);
      filtered = filtered.filter(loc => {
        const lat = loc.latitude;
        const lng = loc.longitude;
        const dist = Math.sqrt(
          Math.pow(lat - userLat, 2) + Math.pow(lng - userLng, 2)
        ) * 111; // Rough km conversion
        return dist <= maxDist;
      });
    }

    onFilter(filtered);
  };

  React.useEffect(() => {
    handleFilter();
  }, [keyword, distance, locations]);

  return (
    <aside className="filter-panel">
      <h3>🔍 Filter</h3>

      <div className="filter-group">
        <label>Keyword Search</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search venues..."
        />
      </div>

      <div className="filter-group">
        <label>Distance (km)</label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Max distance"
          min="1"
          max="50"
        />
      </div>

      <button onClick={() => {
        setKeyword('');
        setDistance('');
      }} className="btn-secondary">
        Reset Filters
      </button>
    </aside>
  );
}

export default FilterPanel;