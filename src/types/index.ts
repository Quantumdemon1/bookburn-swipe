export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface Comment {
  id: string;
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