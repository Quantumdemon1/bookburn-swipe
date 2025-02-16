
import React, { useState } from 'react';
import ReviewCard from '../ReviewCard';

const ReviewList = ({ 
  reviews, 
  isLoading, 
  onLike, 
  onReaction, 
  onShare, 
  sortOrder, 
  onSortOrderChange 
}) => {
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  const handleCommentChange = (reviewId, comment) => {
    setNewComments(prev => ({
      ...prev,
      [reviewId]: comment
    }));
  };

  const handleCommentSubmit = async (reviewId, parentCommentId = null) => {
    if (!newComments[reviewId]?.trim()) return;

    try {
      await api.addComment(reviewId, 1, newComments[reviewId], parentCommentId);
      setNewComments(prev => ({
        ...prev,
        [reviewId]: ''
      }));
      setReplyingTo(null);
      // Trigger review refresh through parent
      await onReaction(reviewId, null, null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };

  const toggleComments = (reviewId) => {
    setExpandedComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Reviews</h2>
        <select 
          value={sortOrder} 
          onChange={(e) => onSortOrderChange(e.target.value)}
          className="border rounded-md p-2 bg-red-600 hover:bg-red-500 text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="mostLiked">Most Liked</option>
        </select>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-4">Loading reviews...</div>
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onLike={onLike}
              onReaction={onReaction}
              onShare={onShare}
              onToggleComments={toggleComments}
              onCommentSubmit={handleCommentSubmit}
              expandedComments={expandedComments}
              newComments={newComments}
              onCommentChange={handleCommentChange}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No reviews yet. Be the first to review this book!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
