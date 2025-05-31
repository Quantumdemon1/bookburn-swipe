export interface User {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: string;
  reviewId: number;
  parentId?: number;
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

export interface Review {
  id: number;
  bookId: number;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  comments?: Comment[];
}

export interface Reaction {
  id: number;
  userId: string;
  reviewId?: number;
  commentId?: number;
  type: string;
  createdAt: string;
}