import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoritesAPI } from '../services/api';
import LocationCard from '../components/LocationCard';
import '../styles/pages.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getAll();
      setFavorites(response.data);
    } catch (err) {
      setError('Failed to load favorites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (locationId) => {
    try {
      await favoritesAPI.remove(locationId);
      setFavorites(favorites.filter(fav => fav._id !== locationId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (loading) return <div className="loading">Loading favorites...</div>;

  return (
    <div className="page">
      <h1>❤️ My Favorite Venues</h1>

      {error && <div className="error-message">{error}</div>}

      {favorites.length > 0 ? (
        <div className="locations-list">
          {favorites.map(location => (
            <div key={location._id} className="favorite-item">
              <Link to={`/location/${location._id}`}>
                <LocationCard location={location} />
              </Link>
              <button
                onClick={() => handleRemove(location._id)}
                className="btn-remove"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't added any favorite venues yet.</p>
          <Link to="/locations" className="btn-primary">
            Explore Venues
          </Link>
        </div>
      )}
    </div>
  );
}

export default Favorites;