const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    maxlength: 500
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Sort comments by newest first
commentSchema.query.sortByNewest = function() {
  return this.sort({ createdAt: -1 });
};

module.exports = mongoose.model('Comment', commentSchema);