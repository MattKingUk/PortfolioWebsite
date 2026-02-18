const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { sanitizeBody } = require('../middleware/sanitize');

const router = express.Router();

function formatCommentPublic(row) {
  const nameParts = row.author.trim().split(/\s+/);
  const avatar =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : row.author.substring(0, 2).toUpperCase();

  return {
    id: row.id,
    postId: row.post_id,
    author: row.author,
    avatar,
    date: row.created_at,
    body: row.body,
  };
}

function formatCommentAdmin(row) {
  return {
    ...formatCommentPublic(row),
    email: row.email || '',
    website: row.website || '',
  };
}

router.get('/post/:postId', param('postId').isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid post ID' });

  const rows = db
    .prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC')
    .all(req.params.postId);
  res.json(rows.map(formatCommentPublic));
});

router.post(
  '/',
  sanitizeBody,
  [
    body('postId').isInt().withMessage('Post ID is required'),
    body('author')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name is required (max 100 chars)'),
    body('body')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Comment is required (max 2000 chars)'),
    body('email')
      .optional({ values: 'falsy' })
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('website')
      .optional({ values: 'falsy' })
      .isURL()
      .withMessage('Invalid URL format'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const post = db.prepare('SELECT id FROM blog_posts WHERE id = ?').get(req.body.postId);
    if (!post) return res.status(404).json({ error: 'Blog post not found' });

    const { postId, author, body: commentBody, email, website } = req.body;

    const result = db
      .prepare(
        'INSERT INTO comments (post_id, author, email, website, body) VALUES (?, ?, ?, ?, ?)'
      )
      .run(postId, author, email || '', website || '', commentBody);

    const created = db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(formatCommentPublic(created));
  }
);

router.get('/admin', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.*, bp.title as post_title
       FROM comments c
       LEFT JOIN blog_posts bp ON c.post_id = bp.id
       ORDER BY c.created_at DESC`
    )
    .all();
  res.json(
    rows.map((row) => ({
      ...formatCommentAdmin(row),
      postTitle: row.post_title || 'Deleted Post',
    }))
  );
});

router.delete('/:id', requireAuth, param('id').isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid comment ID' });

  const existing = db.prepare('SELECT id FROM comments WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Comment not found' });

  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  res.json({ message: 'Comment deleted' });
});

module.exports = router;
