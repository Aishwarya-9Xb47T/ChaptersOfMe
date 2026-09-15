export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  reading_time: string;
  is_featured: number | boolean;
  status: 'published' | 'draft';
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  post_count?: number;
}

export interface Comment {
  id: number;
  post_slug: string;
  author_name: string;
  author_email?: string;
  content: string;
  created_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalSubscribers: number;
  totalMessages: number;
  totalComments: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
}
