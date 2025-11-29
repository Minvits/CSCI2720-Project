import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { locationsAPI } from '../services/api';
import FilterPanel from '../components/FilterPanel';
import LocationCard from '../components/LocationCard';
import '../styles/pages.css';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('name');
  const [userLat, setUserLat] = useState(22.3);
  const [userLng, setUserLng] = useState(114.2);

  useEffect(() => {
    fetchLocations();
  }, [sort]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationsAPI.getAll(sort, {
        lat: userLat,
        lng: userLng
      });
      setLocations(response.data);
      setFilteredLocations(response.data);
    } catch (err) {
      setError('Failed to load locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filtered) => {
    setFilteredLocations(filtered);
  };

  if (loading) return <div className="loading">Loading locations...</div>;

  return (
    <div className="page">
      <h1>📍 Cultural Venues</h1>

      <div className="locations-container">
        <FilterPanel 
          locations={locations}
          onFilter={handleFilter}
          userLat={userLat}
          userLng={userLng}
          onUserLocationChange={(lat, lng) => {
            setUserLat(lat);
            setUserLng(lng);
          }}
        />

        <div className="locations-view">
          <div className="view-controls">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="distance">Sort by Distance</option>
              <option value="events">Sort by Events</option>
            </select>
            <p>{filteredLocations.length} venues found</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="locations-list">
            {filteredLocations.map(location => (
              <Link key={location._id} to={`/location/${location._id}`}>
                <LocationCard location={location} />
              </Link>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="empty-state">
              <p>No venues found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Locations;