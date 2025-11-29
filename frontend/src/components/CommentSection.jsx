import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../services/api';
import '../styles/components.css';

function CommentSection({ locationId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [locationId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getByLocation(locationId);
      setComments(response.data);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await commentsAPI.add(locationId, newComment, rating);
      setNewComment('');
      setRating(5);
      fetchComments();
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await commentsAPI.delete(commentId);
        fetchComments();
      } catch (err) {
        console.error('Failed to delete comment:', err);
      }
    }
  };

  return (
    <div className="comment-section">
      <h2>💬 Comments & Reviews</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this venue..."
          required
        />
        <div className="form-row">
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
            <option value={4}>⭐⭐⭐⭐ Very Good</option>
            <option value={3}>⭐⭐⭐ Good</option>
            <option value={2}>⭐⭐ Fair</option>
            <option value={1}>⭐ Poor</option>
          </select>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">👤 {comment.username}</span>
                <span className="comment-rating">{'⭐'.repeat(comment.rating)}</span>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="comment-delete"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No comments yet. Be the first to share your thoughts!</p>
      )}
    </div>
  );
}

export default CommentSection;