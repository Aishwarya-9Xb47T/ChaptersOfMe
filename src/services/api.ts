import { Post, Category, Comment, Subscriber, ContactMessage, AdminStats, User } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('chapters_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // ---------------- AUTH ----------------
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to verify session');
    return data;
  },

  // ---------------- POSTS ----------------
  async getPosts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
    status?: string;
  }): Promise<Post[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.featured) query.append('featured', 'true');
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${API_BASE}/posts?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');
    return data.posts || [];
  },

  async getAdminPosts(): Promise<Post[]> {
    const res = await fetch(`${API_BASE}/admin/posts`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin posts');
    return data.posts || [];
  },

  async getPostBySlug(slug: string): Promise<{
    post: Post;
    related: Post[];
    navigation: { prev: { title: string; slug: string } | null; next: { title: string; slug: string } | null };
  }> {
    const res = await fetch(`${API_BASE}/posts/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch post');
    return data;
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(post),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create post');
    return data.post;
  },

  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(post),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update post');
    return data.post;
  },

  async deletePost(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete post');
  },

  // ---------------- CATEGORIES ----------------
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch categories');
    return data.categories || [];
  },

  // ---------------- COMMENTS ----------------
  async getComments(postSlug: string): Promise<Comment[]> {
    const res = await fetch(`${API_BASE}/comments/${postSlug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch comments');
    return data.comments || [];
  },

  async addComment(comment: {
    post_slug: string;
    author_name: string;
    author_email?: string;
    content: string;
  }): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit comment');
    return data.comment;
  },

  // ---------------- SUBSCRIBERS ----------------
  async subscribe(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Subscription failed');
    return data;
  },

  async getSubscribers(): Promise<Subscriber[]> {
    const res = await fetch(`${API_BASE}/subscribers`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch subscribers');
    return data.subscribers || [];
  },

  // ---------------- CONTACT ----------------
  async sendContact(message: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message');
    return data;
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch contact messages');
    return data.contacts || [];
  },

  // ---------------- STATS ----------------
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin stats');
    return data.stats;
  },
};
