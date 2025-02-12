
// Simulated book database with public domain content
export const books = [
  {
    id: 1, 
    title: "Robinson Crusoe", 
    author: "Daniel Defoe", 
    price: 9.99,
    tags: ["adventure", "classic", "survival"],
    preview: "I was born in the year 1632, in the city of York, of a good family. My father was a foreign merchant originally from Bremen, who settled first at Hull.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2, 
    title: "The Art of War", 
    author: "Sun Tzu", 
    price: 7.99,
    tags: ["strategy", "classic", "non-fiction"],
    preview: "The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin.",
    coverUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3, 
    title: "The Wealth of Nations", 
    author: "Adam Smith", 
    price: 12.99,
    tags: ["economics", "classic", "non-fiction"],
    preview: "The annual labour of every nation is the fund which originally supplies it with all the necessaries and conveniences of life which it annually consumes.",
    coverUrl: "https://images.unsplash.com/photo-1554495439-b6807d1ecf1a?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4, 
    title: "Frankenstein", 
    author: "Mary Shelley", 
    price: 8.99,
    tags: ["horror", "classic", "science-fiction"],
    preview: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.",
    coverUrl: "https://images.unsplash.com/photo-1601524738525-22614e09fde2?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 5, 
    title: "The Count of Monte Cristo", 
    author: "Alexandre Dumas", 
    price: 11.99,
    tags: ["adventure", "classic", "revenge"],
    preview: "On the 24th of February, 1815, the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna, Trieste, and Naples.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60"
  }
];

// Keep track of shown books
let shownBooks = new Set();

// User preferences object to store tag weights
let userPreferences = {};

// Initialize user preferences
export const initializeUserPreferences = () => {
  books.forEach(book => {
    book.tags.forEach(tag => {
      if (!userPreferences[tag]) {
        userPreferences[tag] = 1; // Neutral weight
      }
    });
  });
};

// Update user preferences based on action
export const updateUserPreferences = (bookId, action) => {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  let weight;
  switch (action) {
    case 'like':
      weight = 0.1;
      break;
    case 'burn':
      weight = -0.1;
      break;
    case 'favorite':
      weight = 0.2;
      break;
    default:
      weight = 0;
  }

  book.tags.forEach(tag => {
    userPreferences[tag] = Math.max(0, Math.min(2, (userPreferences[tag] || 1) + weight));
  });

  // Add to shown books
  shownBooks.add(bookId);

  // Reset shown books if all books have been shown
  if (shownBooks.size === books.length) {
    shownBooks.clear();
  }

  // Save updated preferences to localStorage
  localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
};

// Get book recommendations based on user preferences and genre filter
export const getRecommendations = (page = 1, limit = 10, selectedGenre = 'all') => {
  // Filter books by genre and not shown
  let availableBooks = books.filter(book => 
    !shownBooks.has(book.id) && 
    (selectedGenre === 'all' || book.tags.includes(selectedGenre))
  );

  // If no books available, reset shown books and try again
  if (availableBooks.length === 0) {
    shownBooks.clear();
    availableBooks = books.filter(book => 
      selectedGenre === 'all' || book.tags.includes(selectedGenre)
    );
  }

  return availableBooks.slice(0, limit);
};

// Get next recommended book
export const getNextRecommendation = (currentBookId) => {
  // Add current book to shown books
  shownBooks.add(currentBookId);
  
  // Get available books
  const availableBooks = books.filter(book => !shownBooks.has(book.id));
  
  // If no more books available, reset shown books and return first book
  if (availableBooks.length === 0) {
    shownBooks.clear();
    return books[0];
  }
  
  // Return first available book
  return availableBooks[0];
};

// Search books
export const searchBooks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
