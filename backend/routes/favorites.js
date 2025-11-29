const express = require('express');
const Favorite = require('../models/Favorite');
const Location = require('../models/Location');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's favorite locations
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.userId })
      .populate('locationId');
    
    res.json(favorites.map(fav => fav.locationId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to favorites
router.post('/', auth, async (req, res) => {
  try {
    const { locationId } = req.body;
    
    if (!locationId) {
      return res.status(400).json({ error: 'Location ID required' });
    }
    
    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: req.user.userId,
      locationId
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    
    const favorite = new Favorite({
      userId: req.user.userId,
      locationId
    });
    
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Remove from favorites
router.delete('/:locationId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user.userId,
      locationId: req.params.locationId
    });
    
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if location is favorited
router.get('/check/:locationId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.user.userId,
      locationId: req.params.locationId
    });
    
    res.json({ isFavorited: !!favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;