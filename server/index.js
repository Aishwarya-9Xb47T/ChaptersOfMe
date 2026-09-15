import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, initDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'chapters-of-me-super-secret-key-2026';

// Initialize DB schema & seed data
initDB();

app.use(cors());
app.use(express.json());

// Auth Middleware for protected admin routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

// ----------------- AUTH ROUTES -----------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An error occurred during authentication.' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile.' });
  }
});

// ----------------- POSTS ROUTES -----------------
app.get('/api/posts', (req, res) => {
  try {
    const { category, search, sort, status, featured } = req.query;
    let query = 'SELECT * FROM posts WHERE 1=1';
    const params = [];

    // Filter by status (public view only sees published)
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    } else {
      query += " AND status = 'published'";
    }

    // Filter by category
    if (category && category !== 'all') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    // Filter by featured
    if (featured === 'true' || featured === '1') {
      query += ' AND is_featured = 1';
    }

    // Search in title, excerpt, content
    if (search && search.trim() !== '') {
      query += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    // Sorting
    if (sort === 'oldest') {
      query += ' ORDER BY published_at ASC, id ASC';
    } else {
      query += ' ORDER BY published_at DESC, id DESC';
    }

    const posts = db.prepare(query).all(...params);
    res.json({ posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to retrieve posts.' });
  }
});

// Admin posts route (fetches all posts including drafts)
app.get('/api/admin/posts', authenticateToken, (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin posts.' });
  }
});

app.get('/api/posts/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Fetch related posts in the same category
    const related = db.prepare(`
      SELECT id, title, slug, category, excerpt, reading_time, published_at, cover_image
      FROM posts
      WHERE category = ? AND slug != ? AND status = 'published'
      ORDER BY published_at DESC
      LIMIT 3
    `).all(post.category, post.slug);

    // Fetch prev and next posts
    const prevPost = db.prepare(`
      SELECT title, slug FROM posts
      WHERE published_at < ? AND status = 'published'
      ORDER BY published_at DESC LIMIT 1
    `).get(post.published_at);

    const nextPost = db.prepare(`
      SELECT title, slug FROM posts
      WHERE published_at > ? AND status = 'published'
      ORDER BY published_at ASC LIMIT 1
    `).get(post.published_at);

    res.json({
      post,
      related,
      navigation: {
        prev: prevPost || null,
        next: nextPost || null,
      },
    });
  } catch (err) {
    console.error('Error fetching post by slug:', err);
    res.status(500).json({ error: 'Failed to fetch post.' });
  }
});

// Create Post (Admin only)
app.post('/api/posts', authenticateToken, (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      excerpt,
      content,
      cover_image,
      reading_time,
      is_featured,
      status,
      published_at,
    } = req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({ error: 'Title, category, excerpt, and content are required.' });
    }

    // Auto-generate slug if not provided
    const finalSlug = (slug || title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check slug uniqueness
    const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(finalSlug);
    if (existing) {
      return res.status(400).json({ error: 'A post with this slug or title already exists.' });
    }

    // Estimate reading time if missing
    const wordCount = content.trim().split(/\s+/).length;
    const estTime = reading_time || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const stmt = db.prepare(`
      INSERT INTO posts (
        title, slug, category, excerpt, content, cover_image, reading_time, is_featured, status, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      finalSlug,
      category,
      excerpt,
      content,
      cover_image || null,
      estTime,
      is_featured ? 1 : 0,
      status || 'published',
      published_at || new Date().toISOString().replace('T', ' ').substring(0, 19)
    );

    const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

// Update Post (Admin only)
app.put('/api/posts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      excerpt,
      content,
      cover_image,
      reading_time,
      is_featured,
      status,
      published_at,
    } = req.body;

    const existingPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const finalSlug = slug || existingPost.slug;
    // Check if new slug conflicts with another post
    const conflict = db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(finalSlug, id);
    if (conflict) {
      return res.status(400).json({ error: 'Slug is already in use by another post.' });
    }

    const wordCount = (content || existingPost.content).trim().split(/\s+/).length;
    const estTime = reading_time || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const stmt = db.prepare(`
      UPDATE posts SET
        title = ?,
        slug = ?,
        category = ?,
        excerpt = ?,
        content = ?,
        cover_image = ?,
        reading_time = ?,
        is_featured = ?,
        status = ?,
        published_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      title !== undefined ? title : existingPost.title,
      finalSlug,
      category !== undefined ? category : existingPost.category,
      excerpt !== undefined ? excerpt : existingPost.excerpt,
      content !== undefined ? content : existingPost.content,
      cover_image !== undefined ? cover_image : existingPost.cover_image,
      estTime,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existingPost.is_featured,
      status !== undefined ? status : existingPost.status,
      published_at !== undefined ? published_at : existingPost.published_at,
      id
    );

    const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.json({ post: updatedPost });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Failed to update post.' });
  }
});

// Delete Post (Admin only)
app.delete('/api/posts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    // Also clean up comments associated with this slug
    db.prepare('DELETE FROM comments WHERE post_slug = ?').run(post.slug);

    res.json({ message: 'Post successfully deleted.' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post.' });
  }
});

// ----------------- CATEGORIES -----------------
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON LOWER(c.name) = LOWER(p.category) AND p.status = 'published'
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();

    res.json({ categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// ----------------- COMMENTS -----------------
app.get('/api/comments/:postSlug', (req, res) => {
  try {
    const { postSlug } = req.params;
    const comments = db.prepare(`
      SELECT id, post_slug, author_name, content, created_at
      FROM comments
      WHERE post_slug = ?
      ORDER BY created_at DESC
    `).all(postSlug);

    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    const { post_slug, author_name, author_email, content } = req.body;
    if (!post_slug || !author_name || !content) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO comments (post_slug, author_name, author_email, content)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(post_slug, author_name.trim(), author_email ? author_email.trim() : null, content.trim());
    const newComment = db.prepare('SELECT id, post_slug, author_name, content, created_at FROM comments WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ comment: newComment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to submit comment.' });
  }
});

// ----------------- SUBSCRIBERS -----------------
app.post('/api/subscribers', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const existing = db.prepare('SELECT id FROM subscribers WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.json({ message: 'You are already subscribed to Chapters of Me.' });
    }

    db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(email.toLowerCase().trim());
    res.status(201).json({ message: 'Thank you for subscribing! Welcome to Chapters of Me.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

app.get('/api/subscribers', authenticateToken, (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC').all();
    res.json({ subscribers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscribers.' });
  }
});

// ----------------- CONTACT MESSAGES -----------------
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    db.prepare(`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), email.trim(), subject ? subject.trim() : 'General', message.trim());

    res.status(201).json({ message: 'Your message has been sent warmly. Thank you for reaching out!' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ error: 'Failed to send your message.' });
  }
});

app.get('/api/contact', authenticateToken, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// ----------------- STATS (Admin) -----------------
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  try {
    const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
    const publishedPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'published'").get().count;
    const draftPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'draft'").get().count;
    const totalSubscribers = db.prepare('SELECT COUNT(*) as count FROM subscribers').get().count;
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
    const totalComments = db.prepare('SELECT COUNT(*) as count FROM comments').get().count;

    res.json({
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalSubscribers,
        totalMessages,
        totalComments,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', app: 'Chapters of Me' });
});

app.listen(PORT, () => {
  console.log(`Chapters of Me backend server running on http://localhost:${PORT}`);
});
