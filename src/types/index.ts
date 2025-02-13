
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  bookId: string;
  createdAt: string;
  user?: User;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  tags: string[];
  preview: string;
  coverUrl: string;
}
