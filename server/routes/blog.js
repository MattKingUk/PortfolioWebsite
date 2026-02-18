const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function formatPost(row) {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    date: row.date,
    tags: JSON.parse(row.tags || '[]'),
    excerpt: row.excerpt,
    body: row.body,
    coverImage: row.cover_image,
  };
}

router.get('/posts', (req, res) => {
  const rows = db.prepare('SELECT * FROM blog_posts ORDER BY date DESC').all();
  res.json(rows.map(formatPost));
});

router.get('/posts/latest', (req, res) => {
  const row = db.prepare('SELECT * FROM blog_posts ORDER BY date DESC LIMIT 1').get();
  if (!row) return res.status(404).json({ error: 'No posts found' });
  res.json(formatPost(row));
});

router.get('/posts/search', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) {
    const rows = db.prepare('SELECT * FROM blog_posts ORDER BY date DESC').all();
    return res.json(rows.map(formatPost));
  }

  const pattern = `%${q}%`;
  const rows = db
    .prepare(
      `SELECT * FROM blog_posts
       WHERE LOWER(title) LIKE ? OR LOWER(excerpt) LIKE ? OR LOWER(tags) LIKE ? OR LOWER(author) LIKE ?
       ORDER BY date DESC`
    )
    .all(pattern, pattern, pattern, pattern);
  res.json(rows.map(formatPost));
});

router.get('/posts/:id', param('id').isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid post ID' });

  const row = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Post not found' });
  res.json(formatPost(row));
});

router.post(
  '/posts',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('date').trim().notEmpty().withMessage('Date is required'),
    body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
    body('body').trim().notEmpty().withMessage('Body is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, author, date, tags, excerpt, body: postBody, coverImage } = req.body;
    const tagsJson = JSON.stringify(tags || []);

    const result = db
      .prepare(
        `INSERT INTO blog_posts (title, author, date, tags, excerpt, body, cover_image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(title, author, date, tagsJson, excerpt, postBody, coverImage || '');

    const created = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(formatPost(created));
  }
);

router.put(
  '/posts/:id',
  requireAuth,
  param('id').isInt(),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('date').trim().notEmpty().withMessage('Date is required'),
    body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
    body('body').trim().notEmpty().withMessage('Body is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const existing = db.prepare('SELECT id FROM blog_posts WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Post not found' });

    const { title, author, date, tags, excerpt, body: postBody, coverImage } = req.body;
    const tagsJson = JSON.stringify(tags || []);

    db.prepare(
      `UPDATE blog_posts SET title=?, author=?, date=?, tags=?, excerpt=?, body=?, cover_image=?, updated_at=datetime('now')
       WHERE id = ?`
    ).run(title, author, date, tagsJson, excerpt, postBody, coverImage || '', req.params.id);

    const updated = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
    res.json(formatPost(updated));
  }
);

router.delete('/posts/:id', requireAuth, param('id').isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid post ID' });

  const existing = db.prepare('SELECT id FROM blog_posts WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Post not found' });

  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Post deleted' });
});

module.exports = router;
