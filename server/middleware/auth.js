const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Add it to server/.env');
}

/**
 * Middleware that verifies JWT token from Authorization header.
 * Blocks request with 401 if token is missing or invalid.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    req.adminUsername = decoded.username;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional auth - sets req.isAdmin if valid token present, but doesn't block.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.adminId = decoded.id;
      req.adminUsername = decoded.username;
      req.isAdmin = true;
    } catch {
      req.isAdmin = false;
    }
  } else {
    req.isAdmin = false;
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
