const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

require('./db');

const app = express();

app.set('trust proxy', 'loopback');

const PORT = process.env.PORT || 3000;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin 
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});
app.use('/api/auth/login', authLimiter);

const commentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many comments. Please wait a moment.' },
});
app.use('/api/comments', commentLimiter);

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload', require('./routes/upload'));

// Serve Angular build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist', 'portfolio-try-3', 'browser');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error Handling
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS: Origin not allowed' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
