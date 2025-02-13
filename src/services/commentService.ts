
import type { Comment } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const commentService = {
  getComments: async (bookId: string, page = 1, limit = 10): Promise<{ data: Comment[], total: number }> => {
    await delay(300);
    const comments = JSON.parse(localStorage.getItem(`comments_${bookId}`) || '[]');
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: comments.slice(start, end),
      total: comments.length
    };
  },

  addComment: async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
    await delay(200);
    const newComment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const comments = JSON.parse(localStorage.getItem(`comments_${comment.bookId}`) || '[]');
    comments.unshift(newComment);
    localStorage.setItem(`comments_${comment.bookId}`, JSON.stringify(comments));

    return newComment;
  }
};
