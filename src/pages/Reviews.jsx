
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ReviewEditor from '@/components/ReviewEditor';
import { api } from '@/services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();
  const [selectedBook, setSelectedBook] = useState(1); // Dummy book ID for now
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const dummyUserId = 1; // This would come from authentication in a real app

  useEffect(() => {
    loadReviews();
  }, [selectedBook]);

  const loadReviews = async () => {
    try {
      const fetchedReviews = await api.getReviews(selectedBook);
      setReviews(fetchedReviews);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    }
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

  const handleCommentSubmit = async (reviewId) => {
    const content = newComments[reviewId]?.trim();
    if (!content) return;

    try {
      const comment = await api.addComment(reviewId, dummyUserId, content);
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? {
                ...review,
                comments: [...(review.comments || []), comment]
              }
            : review
        )
      );
      setNewComments(prev => ({
        ...prev,
        [reviewId]: ''
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
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

      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {review.user?.username?.[0] || 'A'}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {review.user?.username || "Anonymous"}
                    </CardTitle>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{review.content}</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(review.id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className={`w-4 h-4 ${review.hasLiked ? 'fill-current text-blue-500' : ''}`} />
                  <span>{review.likes || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(review.id)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{review.comments?.length || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(review)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>

              {expandedComments[review.id] && (
                <div className="mt-4 space-y-4">
                  {review.comments?.map((comment) => (
                    <div key={comment.id} className="pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          {comment.userId}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-gray-800">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComments[review.id] || ''}
                      onChange={(e) => handleCommentChange(review.id, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleCommentSubmit(review.id)}
                      disabled={!newComments[review.id]?.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
