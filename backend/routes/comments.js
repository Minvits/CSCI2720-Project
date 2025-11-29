const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for a location
router.get('/location/:locationId', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ locationId: req.params.locationId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/', auth, async (req, res) => {
  try {
    const { locationId, text, rating } = req.body;
    
    if (!locationId || !text) {
      return res.status(400).json({ error: 'Location and comment text required' });
    }
    
    const comment = new Comment({
      locationId,
      userId: req.user.userId,
      username: req.user.username,
      text,
      rating: rating || 5
    });
    
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Only user who posted or admin can delete
    if (comment.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;