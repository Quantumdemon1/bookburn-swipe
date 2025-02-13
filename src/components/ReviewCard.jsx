
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp, Share2, Heart, Laugh } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CommentSection from './CommentSection';

const ReviewCard = ({ 
  review, 
  onLike, 
  onReaction, 
  onShare, 
  onToggleComments,
  onCommentSubmit,
  expandedComments,
  newComments,
  onCommentChange,
  replyingTo,
  setReplyingTo 
}) => {
  return (
    <Card className="animate-fade-in">
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
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(review.id)}
            className="flex items-center gap-2"
          >
            <ThumbsUp className={`w-4 h-4 ${review.hasLiked ? 'fill-current text-blue-500' : ''}`} />
            <span>{review.likes || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReaction(review.id, null, 'heart')}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${review.reactions?.heart > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{review.reactions?.heart || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReaction(review.id, null, 'laugh')}
            className="flex items-center gap-2"
          >
            <Laugh className={`w-4 h-4 ${review.reactions?.laugh > 0 ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            <span>{review.reactions?.laugh || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComments(review.id)}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{review.comments?.length || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(review)}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>

        {expandedComments[review.id] && (
          <CommentSection
            reviewId={review.id}
            comments={review.comments}
            newComment={newComments[review.id]}
            onCommentChange={onCommentChange}
            onCommentSubmit={onCommentSubmit}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            onReaction={onReaction}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
