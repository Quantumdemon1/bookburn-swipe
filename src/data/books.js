<lov-code>
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
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83d5b814b5a6?w=500&auto=format&fit=crop&q=60"
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
  },
  {
    id: 16,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 10.99,
    tags: ["classic", "romance", "fiction"],
    preview: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 17,
    title: "Design Patterns",
    author: "Gang of Four",
    price: 49.99,
    tags: ["programming", "software engineering", "computer science"],
    preview: "A book that has become an essential reference for object-oriented developers, presenting a catalog of simple and succinct solutions to commonly occurring design problems.",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 18,
    title: "Moby Dick",
    author: "Herman Melville",
    price: 12.99,
    tags: ["classic", "adventure", "fiction"],
    preview: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    coverUrl: "https://images.unsplash.com/photo-1548048026-5a1a941d93d3?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 19,
    title: "Blockchain Basics",
    author: "Daniel Drescher",
    price: 34.99,
    tags: ["technology", "cryptocurrency", "programming"],
    preview: "A non-technical exploration of the fundamental principles behind blockchain technology and its implications for digital currency and beyond.",
    coverUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 20,
    title: "War and Peace",
    author: "Leo Tolstoy",
    price: 15.99,
    tags: ["classic", "historical", "fiction"],
    preview: "Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes. But I warn you, if you don't tell me that this means war, if you still try to defend the infamies and horrors perpetrated by that Antichrist—I really believe he is Antichrist—I will have nothing more to do with you.",
    coverUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 21,
    title: "Machine Learning Fundamentals",
    author: "Dr. Sarah Chen",
    price: 45.99,
    tags: ["technology", "computer science", "artificial intelligence"],
    preview: "A comprehensive introduction to machine learning principles, algorithms, and practical applications in today's data-driven world.",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 22,
    title: "The Time Machine",
    author: "H.G. Wells",
    price: 9.99,
    tags: ["science fiction", "classic", "adventure"],
    preview: "The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated.",
    coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 23,
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    price: 11.99,
    tags: ["classic", "gothic", "fiction"],
    preview: "The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 24,
    title: "Cybersecurity Essentials",
    author: "William Stallings",
    price: 42.99,
    tags: ["technology", "security", "computer science"],
    preview: "A comprehensive guide to understanding and implementing cybersecurity principles in modern computing environments.",
    coverUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 25,
    title: "The Republic",
    author: "Plato",
    price: 13.99,
    tags: ["philosophy", "classic", "non-fiction"],
    preview: "I went down yesterday to the Piraeus with Glaucon the son of Ariston, that I might offer up my prayers to the goddess; and also because I wanted to see in what manner they would celebrate the festival, which was a new thing.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 26,
    title: "The Iliad",
    author: "Homer",
    price: 6.99,
    tags: ["classic", "epic", "mythology"],
    preview: "A brief preview of 'The Iliad' by Homer. An epic poem recounting the events of the Trojan War.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 27,
    title: "The Odyssey",
    author: "Homer",
    price: 8.49,
    tags: ["classic", "epic", "mythology"],
    preview: "A brief preview of 'The Odyssey' by Homer. The long journey home of Odysseus after the Trojan War.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 28,
    title: "Frankenstein",
    author: "Mary Shelley",
    price: 9.99,
    tags: ["classic", "gothic", "science fiction"],
    preview: "A brief preview of 'Frankenstein' by Mary Shelley. A tale of a scientist who creates a living being that turns monstrous.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 29,
    title: "Dracula",
    author: "Bram Stoker",
    price: 11.49,
    tags: ["classic", "horror", "gothic"],
    preview: "A brief preview of 'Dracula' by Bram Stoker. The story of Count Dracula's attempt to move from Transylvania to England.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 30,
    title: "The Strange Case of Dr Jekyll and Mr Hyde",
    author: "Robert Louis Stevenson",
    price: 12.99,
    tags: ["classic", "horror", "fiction"],
    preview: "A brief preview of 'The Strange Case of Dr Jekyll and Mr Hyde' by Robert Louis Stevenson. A study in duality, where a doctor transforms into a monstrous alter ego.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 31,
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    price: 13.49,
    tags: ["classic", "historical", "fiction"],
    preview: "A brief preview of 'A Tale of Two Cities' by Charles Dickens. A story set against the backdrop of the French Revolution.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 32,
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    price: 14.99,
    tags: ["classic", "adventure", "fiction"],
    preview: "A brief preview of 'The Count of Monte Cristo' by Alexandre Dumas. A tale of betrayal, imprisonment, and revenge.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 33,
    title: "The Scarlet Letter",
    author: "Nathaniel Hawthorne",
    price: 16.49,
    tags: ["classic", "historical", "fiction"],
    preview: "A brief preview of 'The Scarlet Letter' by Nathaniel Hawthorne. A story of sin, guilt, and redemption in Puritan America.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 34,
    title: "The Adventures of Tom Sawyer",
    author: "Mark Twain",
    price: 17.99,
    tags: ["classic", "adventure", "fiction"],
    preview: "A brief preview of 'The Adventures of Tom Sawyer' by Mark Twain. The mischievous adventures of a young boy in a small town.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 35,
    title: "The Adventures of Huckleberry Finn",
    author: "Mark Twain",
    price: 19.49,
    tags: ["classic", "adventure", "fiction"],
    preview: "A brief preview of 'The Adventures of Huckleberry Finn' by Mark Twain. A journey down the Mississippi River with a runaway boy and a fugitive slave.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"

    },
    {

        id: 36,
        title: "A Connecticut Yankee in King Arthur's Court",
        author: "Mark Twain",
        price: 20.99,
        tags: ["classic", "satire", "science fiction"],
        preview: "A brief preview of 'A Connecticut Yankee in King Arthur's Court' by Mark Twain. A modern man is transported to medieval times in a satirical tale.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 37,
        title: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        price: 22.49,
        tags: ["classic", "gothic", "fiction"],
        preview: "A brief preview of 'The Picture of Dorian Gray' by Oscar Wilde. A man remains eternally youthful while his portrait ages.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 38,
        title: "The Importance of Being Earnest",
        author: "Oscar Wilde",
        price: 23.99,
        tags: ["classic", "comedy", "satire"],
        preview: "A brief preview of 'The Importance of Being Earnest' by Oscar Wilde. A witty satire on Victorian society and mistaken identities.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 39,
        title: "The Wonderful Wizard of Oz",
        author: "L. Frank Baum",
        "price": 25.49,
        "tags": ["classic", "fantasy", "children"],
        "preview": "A brief preview of 'The Wonderful Wizard of Oz' by L. Frank Baum. A young girl's journey in a magical land to find her way home.",
        "coverUrl": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 40,
        title: "The Time Machine",
        author: "H.G. Wells",
        price: 26.99,
        "tags": ["classic", "science fiction", "adventure"],
        "preview": "A brief preview of 'The Time Machine' by H.G. Wells. An inventor travels far into the future in his time machine.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 41,
        title: "The War of the Worlds",
        author: "H.G. Wells",
        price: 28.49,
        "tags": ["classic", "science fiction", "adventure"],
        preview: "A brief preview of 'The War of the Worlds' by H.G. Wells. A Martian invasion of Earth and humanity's struggle to survive.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 42,
        title: "The Invisible Man",
        author: "H.G. Wells",
        price: 29.99,
        "tags": ["classic", "science fiction", "horror"],
        "preview": "A brief preview of 'The Invisible Man' by H.G. Wells. A scientist discovers the secret of invisibility—with tragic consequences.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 43,
        title: "The Island of Doctor Moreau",
        author: "H.G. Wells",
        price: 31.49,
        "tags": ["classic", "science fiction", "horror"],
        "preview": "A brief preview of 'The Island of Doctor Moreau' by H.G. Wells. A man encounters a scientist who creates human-animal hybrids on a remote island.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 44,
        title: "Treasure Island",
        author: "Robert Louis Stevenson",
        price: 32.99,
        "tags": ["classic", "adventure", "fiction"],
        "preview": "A brief preview of 'Treasure Island' by Robert Louis Stevenson. A thrilling pirate adventure in search of hidden treasure.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 45,
        title: "Kidnapped",
        author: "Robert Louis Stevenson",
        price: 34.49,
        tags: ["classic", "adventure", "fiction"],
        preview: "A brief preview of 'Kidnapped' by Robert Louis Stevenson. A tale of betrayal and adventure set in 18th-century Scotland.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"

    },
    {

        id: 46,
        title: "Three Sisters",
        author: "Anton Chekhov",
        price: 26.99,
        tags: ["classic", "drama", "tragedy"],
        preview: "A story of three sisters yearning for a better life amidst change.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 47,
        title: "Uncle Vanya",
        author: "Anton Chekhov",
        price: 27.49,
        tags: ["classic", "drama", "tragedy"],
        preview: "A play depicting the frustrations and unfulfilled dreams of rural life.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 48,
        title: "The Seagull",
        author: "Anton Chekhov",
        price: 28.99,
        tags: ["classic", "drama", "tragedy"],
        preview: "A play exploring the conflicts between art and life.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 49,
        title: "Anna Karenina",
        author: "Leo Tolstoy",
        price: 30.49,
        tags: ["classic", "romance", "fiction"],
        preview: "A tragic love story set against the backdrop of Russian high society.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 50,
        title: "Resurrection",
        author: "Leo Tolstoy",
        price: 31.99,
        tags: ["classic", "philosophical", "fiction"],
        preview: "A novel about redemption and the search for meaning in life.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 51,
        title: "The Death of Ivan Ilyich",
        author: "Leo Tolstoy",
        price: 33.49,
        tags: ["classic", "philosophical", "fiction"],
        preview: "A haunting novella about the existential reflections of a dying man.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 52,
        title: "Fathers and Sons",
        author: "Ivan Turgenev",
        price: 34.99,
        tags: ["classic", "social", "fiction"],
        preview: "A novel exploring the generational clash in 19th-century Russia.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 53,
        title: "A Sportsman's Sketches",
        author: "Ivan Turgenev",
        price: 36.49,
        tags: ["classic", "nature", "fiction"],
        preview: "Short stories depicting rural Russian life and nature.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 54,
        title: "The Metamorphosis",
        author: "Franz Kafka",
        price: 37.99,
        tags: ["classic", "absurdist", "fiction"],
        preview: "A man wakes up one morning transformed into a giant insect.",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&
