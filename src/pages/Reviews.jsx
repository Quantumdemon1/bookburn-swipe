import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ReviewEditor from '@/components/ReviewEditor';
import ReviewCard from '@/components/ReviewCard';
import { api } from '@/services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();
  const [selectedBook, setSelectedBook] = useState(1);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const dummyUserId = 1;

  useEffect(() => {
    loadReviews();
  }, [selectedBook, sortOrder]);

  const loadReviews = async () => {
    try {
      const fetchedReviews = await api.getReviews(selectedBook);
      const sortedReviews = sortReviews(fetchedReviews, sortOrder);
      setReviews(sortedReviews);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    }
  };

  const sortReviews = (reviewsToSort, order) => {
    return [...reviewsToSort].sort((a, b) => {
      switch (order) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostLiked':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
  };

  const handleLike = async (reviewId) => {
    try {
      const { likes, hasLiked } = await api.toggleLike(reviewId, dummyUserId);
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? { ...review, likes, hasLiked }
            : review
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const handleReaction = async (reviewId, commentId, reactionType) => {
    try {
      const updatedReactions = await api.addReaction(reviewId, commentId, dummyUserId, reactionType);
      setReviews(prevReviews =>
        prevReviews.map(review => {
          if (review.id !== reviewId) return review;
          
          if (!commentId) {
            return { ...review, reactions: updatedReactions };
          }

          const updateCommentReactions = (comments) =>
            comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, reactions: updatedReactions };
              }
              if (comment.replies?.length) {
                return {
                  ...comment,
                  replies: updateCommentReactions(comment.replies)
                };
              }
              return comment;
            });

          return {
            ...review,
            comments: updateCommentReactions(review.comments || [])
          };
        })
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reaction",
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

  const handleCommentChange = (reviewId, value) => {
    setNewComments(prev => ({
      ...prev,
      [reviewId]: value
    }));
  };

  const handleCommentSubmit = async (reviewId, parentId = null) => {
    const content = newComments[reviewId]?.trim();
    if (!content) return;

    try {
      const comment = await api.addComment(reviewId, dummyUserId, content, parentId);
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? {
                ...review,
                comments: parentId
                  ? updateCommentsWithReply(review.comments || [], parentId, comment)
                  : [...(review.comments || []), comment]
              }
            : review
        )
      );
      setNewComments(prev => ({
        ...prev,
        [reviewId]: ''
      }));
      setReplyingTo(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };

  const updateCommentsWithReply = (comments, parentId, newReply) => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      if (comment.replies?.length) {
        return {
          ...comment,
          replies: updateCommentsWithReply(comment.replies, parentId, newReply)
        };
      }
      return comment;
    });
  };

  const handleShare = async (review) => {
    try {
      await navigator.share({
        title: 'Check out this book review',
        text: `${review.content.substring(0, 100)}...`,
        url: window.location.href
      });
    } catch (error) {
      toast({
        title: "Info",
        description: "Sharing is not supported on this device",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Book Reviews</h1>
      
      <ReviewEditor 
        bookId={selectedBook} 
        onReviewSubmitted={loadReviews}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Reviews</h2>
        <select
          className="border rounded-md p-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="mostLiked">Most Liked</option>
        </select>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onLike={handleLike}
            onReaction={handleReaction}
            onShare={handleShare}
            onToggleComments={toggleComments}
            onCommentSubmit={handleCommentSubmit}
            expandedComments={expandedComments}
            newComments={newComments}
            onCommentChange={handleCommentChange}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
          />
        ))}
      </div>
    </div>
  );
};

export default Reviews;
