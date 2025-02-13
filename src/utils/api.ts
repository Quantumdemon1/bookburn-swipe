
import { bookService } from '../services/bookService';
import { commentService } from '../services/commentService';

export const api = {
  books: bookService,
  comments: commentService,
  // Will add auth, users, etc. later
};
