const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function formatProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tags: JSON.parse(row.tags || '[]'),
    coverImage: row.cover_image,
    images: JSON.parse(row.images || '[]'),
    liveUrl: row.live_url || '',
    repoUrl: row.repo_url || '',
    body: row.body,
    date: row.date,
  };
}

router.get('/projects', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY date DESC').all();
  res.json(rows.map(formatProject));
});

router.get('/projects/:id', param('id').isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid project ID' });

  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Project not found' });
  res.json(formatProject(row));
});

router.post(
  '/projects',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('body').trim().notEmpty().withMessage('Body is required'),
    body('date').trim().notEmpty().withMessage('Date is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, description, tags, coverImage, images, liveUrl, repoUrl, body: projBody, date } = req.body;
    const tagsJson = JSON.stringify(tags || []);
    const imagesJson = JSON.stringify(images || []);

    const result = db
      .prepare(
        `INSERT INTO projects (title, description, tags, cover_image, images, live_url, repo_url, body, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(title, description, tagsJson, coverImage || '', imagesJson, liveUrl || '', repoUrl || '', projBody, date);

    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(formatProject(created));
  }
);

router.put(
  '/projects/:id',
  requireAuth,
  param('id').isInt(),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('body').trim().notEmpty().withMessage('Body is required'),
    body('date').trim().notEmpty().withMessage('Date is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const { title, description, tags, coverImage, images, liveUrl, repoUrl, body: projBody, date } = req.body;
    const tagsJson = JSON.stringify(tags || []);
    const imagesJson = JSON.stringify(images || []);

    db.prepare(
      `UPDATE projects SET title=?, description=?, tags=?, cover_image=?, images=?, live_url=?, repo_url=?, body=?, date=?, updated_at=datetime('now')
       WHERE id = ?`
    ).run(title, description, tagsJson, coverImage || '', imagesJson, liveUrl || '', repoUrl || '', projBody, date, req.params.id);

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    res.json(formatProject(updated));
  }
);

router.delete('/projects/:id', requireAuth, param('id').isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid project ID' });

  const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ message: 'Project deleted' });
});

module.exports = router;
