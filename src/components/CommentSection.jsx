
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Heart, Laugh } from 'lucide-react';
import Comment from './Comment';

const CommentSection = ({
  reviewId,
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit,
  replyingTo,
  setReplyingTo,
  onReaction
}) => {
  return (
    <div className="mt-4 space-y-4">
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          reviewId={reviewId}
          depth={0}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          onCommentChange={onCommentChange}
          onCommentSubmit={onCommentSubmit}
          newComment={newComment}
          onReaction={onReaction}
        />
      ))}
      <div className="flex gap-2 mt-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment || ''}
          onChange={(e) => onCommentChange(reviewId, e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => onCommentSubmit(reviewId)}
          disabled={!newComment?.trim()}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
