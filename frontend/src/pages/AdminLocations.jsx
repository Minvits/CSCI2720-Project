import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import '../styles/pages.css';

function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    venueId: '',
    name: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.locations.getAll();
      setLocations(response.data);
    } catch (err) {
      setError('Failed to load locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    if (!formData.venueId || !formData.name || !formData.latitude || !formData.longitude) {
      setError('All fields are required');
      return;
    }

    try {
      console.log('Sending location data:', formData);
      await adminAPI.locations.create({
        venueId: formData.venueId,
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });
      setSuccess('Location created successfully');
      setFormData({ venueId: '', name: '', latitude: '', longitude: '' });
      setShowForm(false);
      fetchLocations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create location');
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await adminAPI.locations.delete(locationId);
        setSuccess('Location deleted successfully');
        fetchLocations();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete location');
      }
    }
  };

  if (loading) return <div className="loading">Loading locations...</div>;

  return (
    <div className="page">
      <h1>Manage Locations</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          ➕ Add New Location
        </button>
      ) : (
        <form className="admin-form" onSubmit={handleCreateLocation}>
          <h2>Add New Location</h2>
          
          <div className="form-group">
            <label>Venue ID:</label>
            <input
              type="text"
              name="venueId"
              value={formData.venueId}
              onChange={handleInputChange}
              placeholder="e.g., 50110014"
              required
            />
          </div>

          <div className="form-group">
            <label>Venue Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Hong Kong Cultural Centre Concert Hall"
              required
            />
          </div>

          <div className="form-group">
            <label>Latitude:</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="e.g., 22.29386"
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label>Longitude:</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="e.g., 114.17053"
              step="any"
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">Create Location</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-container">
        <h2>All Locations ({locations.length})</h2>
        {locations.length === 0 ? (
          <p>No locations found</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Venue ID</th>
                <th>Name</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(location => (
                <tr key={location._id}>
                  <td>{location.venueId}</td>
                  <td>{location.name}</td>
                  <td>{location.latitude}</td>
                  <td>{location.longitude}</td>
                  <td>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeleteLocation(location._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminLocations;
