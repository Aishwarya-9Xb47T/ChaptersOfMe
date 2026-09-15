import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'chapters.db');
export const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT,
      reading_time TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_slug TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_email TEXT,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Admin user if not exists
  const existingAuthor = db.prepare('SELECT id FROM users WHERE email = ?').get('nsaishwarya777@gmail.com');
  if (!existingAuthor) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('Aishu@999', salt);
    db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)').run(
      'nsaishwarya777@gmail.com',
      hash,
      'N. S. Aishwarya'
    );
    console.log('Seeded default admin user: nsaishwarya777@gmail.com');
  }

  // Seed Categories
  const categories = [
    { name: 'Poetry', slug: 'poetry', description: 'Verses on love, longing, stillness, and healing.' },
    { name: 'Life & Lessons', slug: 'life-lessons', description: 'Hard-won wisdom, quiet epiphanies, and honest reflections.' },
    { name: 'Family', slug: 'family', description: 'Roots, unconditional affection, and memories that anchor us.' },
    { name: 'Dreams', slug: 'dreams', description: 'Wishes woven in the quiet hours and the courage to pursue them.' },
    { name: 'Student Life', slug: 'student-life', description: 'Classrooms, pressure, self-discovery, and sleepless nights.' },
    { name: 'Personal Growth', slug: 'personal-growth', description: 'Becoming comfortable in your own skin and choosing courage.' }
  ];

  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)');
  for (const cat of categories) {
    insertCategory.run(cat.name, cat.slug, cat.description);
  }

  // Seed sample posts if empty
  const countPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get();
  if (countPosts.count === 0) {
    console.log('Seeding initial blog posts...');

    const samplePosts = [
      {
        title: 'The Things We Never Say Out Loud',
        slug: 'the-things-we-never-say-out-loud',
        category: 'Poetry',
        excerpt: 'Between the words we swallow and the glances we turn away, lies an entire unspoken continent of longing and quiet grace.',
        reading_time: '2 min read',
        is_featured: 1,
        status: 'published',
        published_at: '2026-09-06 18:30:00',
        cover_image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop',
        content: `We keep the heaviest truths
folded tight inside our coat pockets,
fearing that the light of noon
might burn their delicate edges.

We say, *"I am fine,"*
when the chest is a cage of wild sparrows.
We say, *"It doesn't matter,"*
to the very things that carved our nights in half.

How strange, this human habit
of swallowing oceans
and offering a polite cup of tea.

> *I saw you looking at the horizon yesterday,*
> *carrying an entire conversation you will never begin.*
> *I did not interrupt,*
> *for I was guarding my own quiet shore.*

If we could lay our silences
side by side along the windowsill,
we would see they are made of the same yearning:
to be seen without explaining,
to be held without asking,
and to be forgiven for all the words
that stayed too frightened to breathe.`
      },
      {
        title: 'Dreams That Keep Me Awake',
        slug: 'dreams-that-keep-me-awake',
        category: 'Dreams',
        excerpt: 'Not all dreams are born while we sleep; some awaken us in the dark and demand we become someone braver by morning.',
        reading_time: '4 min read',
        is_featured: 1,
        status: 'published',
        published_at: '2026-08-15 21:00:00',
        cover_image: '/dreams-awake.jpg',
        content: `Midnight has a way of stripping away every rationalization we spent the daytime building.

When the house goes quiet and the blue light of the phone fades into darkness, a particular category of thought emerges. It isn't anxiety, though it shares its pulse. It is the persistent, stubborn hum of a dream that refuses to stay dormant.

### The Audacity to Want More
For a long time, I tried to convince myself that wanting to write, to create, to share vulnerability with the world was an impractical luxury. We are taught to prefer security, to choose well-trodden corridors with predictable ceilings.

Yet, every notebook I filled in secret was an act of quiet rebellion. Every scribbled line on the margin of lecture notes was living proof that something deeper inside was yearning for daylight.

> "Your dreams are not random; they are compass needles pointing directly to the parts of your life waiting to be lived."

### Stepping Into the Arena
Building *Chapters of Me* came from one of those sleepless nights. A sudden realization struck me in the quiet dark: if I waited until I felt 100% prepared, completely fearless, or utterly infallible, I would spend my entire youth in rehearsal.

The truth is, courage doesn't come before you take the leap. Courage is what meets you mid-air. It is found in the trembling hand that clicks 'publish', the heart that dares to express grief, longing, and hope without an apology, and the quiet resolve to be genuine in a world full of masks.

### A Gentle Whispered Truth
If you have a dream stirring inside you tonight—whether it is to write your story, speak an unspoken truth, switch paths towards what makes your spirit sing, or love someone without reservations—do not silence it.

Do not dismiss your restlessness as a flaw. It is awake because **you are ready**.\`
      }
    ];

    const insertPost = db.prepare(`
      INSERT INTO posts (title, slug, category, excerpt, content, cover_image, reading_time, is_featured, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const post of samplePosts) {
      insertPost.run(
        post.title,
        post.slug,
        post.category,
        post.excerpt,
        post.content,
        post.cover_image,
        post.reading_time,
        post.is_featured,
        post.status,
        post.published_at
      );
    }

    // Seed sample comments
    const insertComment = db.prepare(`
      INSERT INTO comments (post_slug, author_name, author_email, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertComment.run(
      'the-things-we-never-say-out-loud',
      'Karthik S.',
      'karthik@example.com',
      'Such beautiful and evocative lines. "swallowing oceans and offering a polite cup of tea" is unforgettable.',
      '2026-09-08 09:15:00'
    );
  }
}
