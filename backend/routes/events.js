const express = require('express');
const Event = require('../models/Event');
const Location = require('../models/Location');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get events for a location
router.get('/location/:locationId', auth, async (req, res) => {
  try {
    const events = await Event.find({ locationId: req.params.locationId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Random event picker
router.get('/random/pick', auth, async (req, res) => {
  try {
    const count = await Event.countDocuments();
    const random = Math.floor(Math.random() * count);
    const event = await Event.findOne().skip(random).populate('locationId');
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create event
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { locationId, title, date, description, presenter } = req.body;
    
    if (!locationId || !title) {
      return res.status(400).json({ error: 'Location and title required' });
    }
    
    const event = new Event({
      locationId,
      title,
      date,
      description,
      presenter
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update event
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete event
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;