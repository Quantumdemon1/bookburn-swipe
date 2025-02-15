
import { useMemo } from 'react';

export const useBookFiltering = (books, searchQuery, minReadingTime, sortBy, sortOrder) => {
  return useMemo(() => {
    let filteredBooks = [...books];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    // Apply reading time filter
    filteredBooks = filteredBooks.filter(book => book.timeSpent >= minReadingTime);

    // Apply sorting
    filteredBooks.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.viewedAt) - new Date(a.viewedAt);
          break;
        case 'time':
          comparison = b.timeSpent - a.timeSpent;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    // Group books by time period
    return filteredBooks.reduce((groups, book) => {
      const now = new Date();
      const viewDate = new Date(book.viewedAt);
      const dayDiff = Math.floor((now - viewDate) / (1000 * 60 * 60 * 24));

      let group = 'Earlier';
      if (dayDiff === 0) group = 'Today';
      else if (dayDiff === 1) group = 'Yesterday';
      else if (dayDiff < 7) group = 'This Week';

      if (!groups[group]) groups[group] = [];
      groups[group].push(book);
      return groups;
    }, {});
  }, [books, searchQuery, minReadingTime, sortBy, sortOrder]);
};
