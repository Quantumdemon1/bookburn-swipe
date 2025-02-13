
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Heart, Laugh } from 'lucide-react';

const Comment = ({
  comment,
  reviewId,
  depth,
  replyingTo,
  setReplyingTo,
  onCommentChange,
  onCommentSubmit,
  newComment,
  onReaction
}) => {
  return (
    <div className={`pl-${depth * 4} border-l-2 border-gray-200 ml-4 mt-2`}>
      <div className="flex items-center space-x-2 mb-1">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
          {comment.userId}
        </div>
        <div className="flex-grow">
          <p className="text-sm text-gray-600">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-800">{comment.content}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-1 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onReaction(reviewId, comment.id, 'heart')}
          className="p-1 h-auto"
        >
          <Heart className={`w-4 h-4 ${comment.reactions?.heart > 0 ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="ml-1 text-xs">{comment.reactions?.heart || 0}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onReaction(reviewId, comment.id, 'laugh')}
          className="p-1 h-auto"
        >
          <Laugh className={`w-4 h-4 ${comment.reactions?.laugh > 0 ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          <span className="ml-1 text-xs">{comment.reactions?.laugh || 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReplyingTo(comment.id)}
          className="p-1 h-auto"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="ml-1 text-xs">Reply</span>
        </Button>
      </div>

      {replyingTo === comment.id && (
        <div className="flex gap-2 mt-2 mb-4">
          <Textarea
            placeholder="Write a reply..."
            value={newComment || ''}
            onChange={(e) => onCommentChange(reviewId, e.target.value)}
            className="flex-1 text-sm"
          />
          <Button
            size="sm"
            onClick={() => onCommentSubmit(reviewId, comment.id)}
            disabled={!newComment?.trim()}
          >
            Reply
          </Button>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="ml-4">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              reviewId={reviewId}
              depth={depth + 1}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              onCommentChange={onCommentChange}
              onCommentSubmit={onCommentSubmit}
              newComment={newComment}
              onReaction={onReaction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
