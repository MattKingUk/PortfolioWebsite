const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'portfolio.db');

const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables 
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    date TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]',
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    cover_image TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]',
    cover_image TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    live_url TEXT DEFAULT '',
    repo_url TEXT DEFAULT '',
    body TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    email TEXT DEFAULT '',
    website TEXT DEFAULT '',
    body TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
  );
`);

// Create default admin user if none exists
function ensureAdminUser() {
  const existing = db.prepare('SELECT id FROM admin_users LIMIT 1').get();
  if (!existing) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password === 'changeme123') {
      console.warn('WARNING: Set a strong ADMIN_PASSWORD in server/.env before deploying!');
    }
    const hash = bcrypt.hashSync(password || 'changeme123', 12);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(username, hash);
    console.log(`Admin user "${username}" created. CHANGE THE PASSWORD after first login.`);
  }
}

// Insert default settings if empty
function ensureDefaultSettings() {
  const count = db.prepare('SELECT COUNT(*) as c FROM settings').get();
  if (count.c === 0) {
    const defaults = {
      site_title: 'Matt King',
      site_subtitle: 'Software Engineer',
      blog_title: 'Blog',
      blog_subtitle: 'Thoughts on software engineering, design, and the things I learn along the way.',
      portfolio_title: 'Portfolio',
      portfolio_subtitle: 'A collection of solo projects I have worked on.',
      contact_email: 'matt@mattking.uk',
      contact_phone: '+44 7765 016924',
      footer_copyright: '© 2026 Matt King. All rights reserved.',
    };
    const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    const insertMany = db.transaction((entries) => {
      for (const [key, value] of entries) {
        insert.run(key, value);
      }
    });
    insertMany(Object.entries(defaults));
    console.log('Default settings created.');
  }
}

ensureAdminUser();
ensureDefaultSettings();

module.exports = db;
