
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
    coverUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4, 
    title: "Frankenstein", 
    author: "Mary Shelley", 
    price: 8.99,
    tags: ["horror", "classic", "science-fiction"],
    preview: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 5, 
    title: "The Count of Monte Cristo", 
    author: "Alexandre Dumas", 
    price: 11.99,
    tags: ["adventure", "classic", "revenge"],
    preview: "On the 24th of February, 1815, the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna, Trieste, and Naples.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 6, 
    title: "The Art of Computer Programming",
    author: "Donald Knuth",
    price: 59.99,
    tags: ["algorithms", "computer science", "programming"],
    preview: "A comprehensive monograph written by Donald Knuth that covers many kinds of programming algorithms and their analysis.",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 39.99,
    tags: ["software engineering", "best practices", "programming"],
    preview: "A handbook of agile software craftsmanship that emphasizes the importance of writing clean, readable, and maintainable code.",
    coverUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    price: 44.99,
    tags: ["software development", "programming", "best practices"],
    preview: "A book about software engineering that provides practical advice on a wide range of topics, from personal responsibility to career development.",
    coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 14.99,
    tags: ["fantasy", "adventure", "classic"],
    preview: "A fantasy novel and children's book by J.R.R. Tolkien, it follows the quest of home-loving hobbit Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.",
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 10,
    title: "1984",
    author: "George Orwell",
    price: 12.99,
    tags: ["dystopian", "political fiction", "classic"],
    preview: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviors within society.",
    coverUrl: "https://images.unsplash.com/photo-1557428894-56bcc97113fe?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 11,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 13.99,
    tags: ["classic", "social issues", "fiction"],
    preview: "A novel by Harper Lee published in 1960. Instantly successful, it won the Pulitzer Prize and has become a classic of modern American literature.",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 12,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 11.99,
    tags: ["classic", "American literature", "fiction"],
    preview: "A 1925 novel written by American author F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 13,
    title: "Brave New World",
    author: "Aldous Huxley",
    price: 13.99,
    tags: ["dystopian", "science fiction", "classic"],
    preview: "A dystopian social science fiction novel by English author Aldous Huxley, written in 1931 and published in 1932, set in a futuristic World State, whose citizens are environmentally engineered into an intelligence-based social hierarchy.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 14,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 12.99,
    tags: ["classic", "coming of age", "fiction"],
    preview: "A novel by J.D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951. It was originally intended for adults but is often read by adolescents for its themes of angst and alienation.",
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 15,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    price: 29.99,
    tags: ["fantasy", "adventure", "epic"],
    preview: "An epic high-fantasy novel written by English author and scholar J.R.R. Tolkien. The story began as a sequel to Tolkien's 1937 fantasy novel The Hobbit, but eventually developed into a much larger work.",
    coverUrl: "https://images.unsplash.com/photo-1479813183133-7e558ec2e308?w=500&auto=format&fit=crop&q=60"
  }
];
