export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: number
          title: string
          author: string
          price: number
          tags: string[]
          preview: string
          cover_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          author: string
          price: number
          tags: string[]
          preview: string
          cover_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          author?: string
          price?: number
          tags?: string[]
          preview?: string
          cover_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: number
          book_id: number
          user_id: string
          content: string
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          book_id: number
          user_id: string
          content: string
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          book_id?: number
          user_id?: string
          content?: string
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: number
          user_id: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          preferences: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: number
          review_id: number
          user_id: string
          content: string
          parent_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          review_id: number
          user_id: string
          content: string
          parent_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          review_id?: number
          user_id?: string
          content?: string
          parent_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}