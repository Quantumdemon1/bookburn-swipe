import { api } from './api';
import type { Comment } from '../types';

export const commentService = {
  getComments: async (bookId: string, page = 1, limit = 10): Promise<{ data: Comment[], total: number }> => {
    const { data, error } = await api.getReviews(bookId);
    if (error) throw error;

    const comments = data?.flatMap(review => review.comments || []) || [];
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: comments.slice(start, end),
      total: comments.length
    };
  },

  addComment: async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
    const { data, error } = await api.addComment(
      comment.reviewId,
      comment.userId,
      comment.text
    );
    if (error) throw error;
    return data;
  }
};