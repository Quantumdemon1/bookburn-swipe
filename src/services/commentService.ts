import { api } from './api';
import type { Comment } from '../types';

export const commentService = {
  getComments: async (reviewId: number): Promise<Comment[]> => {
    const { data, error } = await api.getComments(reviewId);
    if (error) throw error;
    return data || [];
  },

  addComment: async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
    const { data, error } = await api.addComment(
      comment.reviewId,
      comment.userId,
      comment.content,
      comment.parentId
    );
    if (error) throw error;
    return data;
  },

  addReaction: async (commentId: number, userId: string, type: string): Promise<void> => {
    const { error } = await api.addReaction(null, commentId, userId, type);
    if (error) throw error;
  }
};