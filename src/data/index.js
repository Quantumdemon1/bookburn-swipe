
import { classics } from './categories/classics';
import { philosophy } from './categories/philosophy';
import { fiction } from './categories/fiction';
import { technical } from './categories/technical';

export const books = [
  ...classics,
  ...philosophy,
  ...fiction,
  ...technical
];

// Helper functions to get books by category
export const getBooksByCategory = (category) => {
  switch (category) {
    case 'classics':
      return classics;
    case 'philosophy':
      return philosophy;
    case 'fiction':
      return fiction;
    case 'technical':
      return technical;
    default:
      return books;
  }
};

export const getBookById = (id) => books.find(book => book.id === id);
