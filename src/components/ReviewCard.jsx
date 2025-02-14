
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp, Share2, Heart, Laugh } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <Card className="animate-fade-in group hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 transition-transform group-hover:scale-105">
              <AvatarImage src={review.user?.avatar} alt={review.user?.username} />
              <AvatarFallback className="bg-primary/10">
                {review.user?.username?.[0] || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">
                {review.user?.username || "Anonymous"}
              </CardTitle>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 transition-all ${
                      star <= review.rating 
                        ? 'text-yellow-400 fill-yellow-400 animate-scale-in' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-6 leading-relaxed">{review.content}</p>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(review.id)}
            className={`flex items-center gap-2 transition-colors hover:bg-primary/10 ${
              review.hasLiked ? 'text-primary' : ''
            }`}
          >
            <ThumbsUp className={`w-4 h-4 transition-transform hover:scale-110 ${
              review.hasLiked ? 'fill-current animate-scale-in' : ''
            }`} />
            <span className="font-medium">{review.likes || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReaction(review.id, null, 'heart')}
            className={`flex items-center gap-2 transition-colors hover:bg-red-100 ${
              review.reactions?.heart > 0 ? 'text-red-500' : ''
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform hover:scale-110 ${
              review.reactions?.heart > 0 ? 'fill-current animate-scale-in' : ''
            }`} />
            <span className="font-medium">{review.reactions?.heart || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReaction(review.id, null, 'laugh')}
            className={`flex items-center gap-2 transition-colors hover:bg-yellow-100 ${
              review.reactions?.laugh > 0 ? 'text-yellow-500' : ''
            }`}
          >
            <Laugh className={`w-4 h-4 transition-transform hover:scale-110 ${
              review.reactions?.laugh > 0 ? 'fill-current animate-scale-in' : ''
            }`} />
            <span className="font-medium">{review.reactions?.laugh || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComments(review.id)}
            className="flex items-center gap-2 transition-colors hover:bg-blue-100"
          >
            <MessageSquare className="w-4 h-4 transition-transform hover:scale-110" />
            <span className="font-medium">{review.comments?.length || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(review)}
            className="flex items-center gap-2 ml-auto transition-colors hover:bg-primary/10"
          >
            <Share2 className="w-4 h-4 transition-transform hover:scale-110" />
            <span className="font-medium">Share</span>
          </Button>
        </div>

        {expandedComments[review.id] && (
          <div className="animate-accordion-down">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
