// frontend/src/pages/AdminEvents.jsx

import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import '../styles/pages.css';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    presenter: '',
    locationId: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchLocations();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.events.getAll();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await adminAPI.locations.getAll();
      setLocations(response.data);
    } catch (err) {
      console.error('Failed to load locations:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.locationId) {
      setError('Title, date, and location are required');
      return;
    }

    try {
      await adminAPI.events.create({
        title: formData.title,
        date: formData.date,
        time: formData.time,
        description: formData.description,
        presenter: formData.presenter,
        locationId: formData.locationId
      });
      setSuccess('Event created successfully');
      setFormData({
        title: '',
        date: '',
        time: '',
        description: '',
        presenter: '',
        locationId: ''
      });
      setShowForm(false);
      fetchEvents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await adminAPI.events.delete(eventId);
        setSuccess('Event deleted successfully');
        fetchEvents();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  const getLocationName = (locationId) => {
    const location = locations.find(l => l._id === locationId);
    return location ? location.name : 'Unknown Venue';
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="page">
      <h1>Manage Events</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          ➕ Add New Event
        </button>
      ) : (
        <form className="admin-form" onSubmit={handleCreateEvent}>
          <h2>Add New Event</h2>

          <div className="form-group">
            <label>Event Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Venue:</label>
            <select 
              name="locationId" 
              value={formData.locationId} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select Venue</option>
              {locations.map(location => (
                <option key={location._id} value={location._id}>
                  {location.name} ({location.area})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter event description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Presenter/Organization:</label>
            <input
              type="text"
              name="presenter"
              value={formData.presenter}
              onChange={handleInputChange}
              placeholder="Enter presenter/organization"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-save">Save Event</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-container">
        <h2>All Events ({events.length})</h2>
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Presenter</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.time}</td>
                  <td>{getLocationName(event.locationId)}</td>
                  <td>{event.presenter}</td>
                  <td>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeleteEvent(event._id)}
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

export default AdminEvents;
