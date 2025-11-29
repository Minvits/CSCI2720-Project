const express = require('express');
const Location = require('../models/Location');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all locations with event counts
router.get('/', auth, async (req, res) => {
  try {
    const { sort = 'name', area, distance, keyword } = req.query;
    
    let query = {};
    
    // Filter by keyword
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    
    // Filter by distance from a reference point (default: Central HK)
    if (distance) {
      const refLat = parseFloat(req.query.lat) || 22.3;
      const refLng = parseFloat(req.query.lng) || 114.2;
      const maxDistance = parseFloat(distance) * 1000; // Convert km to meters
      
      query.$expr = {
        $lte: [
          {
            $sqrt: {
              $add: [
                { $pow: [{ $subtract: ['$latitude', refLat] }, 2] },
                { $pow: [{ $subtract: ['$longitude', refLng] }, 2] }
              ]
            }
          },
          maxDistance / 111000 // Rough conversion
        ]
      };
    }
    
    let locations = await Location.find(query);
    
    // Sort
    if (sort === 'distance') {
      const refLat = parseFloat(req.query.lat) || 22.3;
      const refLng = parseFloat(req.query.lng) || 114.2;
      
      locations.sort((a, b) => {
        const distA = Math.hypot(a.latitude - refLat, a.longitude - refLng);
        const distB = Math.hypot(b.latitude - refLat, b.longitude - refLng);
        return distA - distB;
      });
    } else if (sort === 'events') {
      locations.sort((a, b) => b.eventCount - a.eventCount);
    } else {
      locations.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single location details
router.get('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    const events = await Event.find({ locationId: req.params.id });
    
    res.json({
      ...location.toObject(),
      events
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search locations
router.get('/search/query', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const locations = await Location.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;