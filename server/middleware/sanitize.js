/**
 * Recursively strips HTML tags from all string values in an object/array.
 */
function stripHtml(value) {
  if (typeof value === 'string') {
    return value
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '');
  }
  if (Array.isArray(value)) {
    return value.map(stripHtml);
  }
  if (value && typeof value === 'object') {
    const cleaned = {};
    for (const key of Object.keys(value)) {
      cleaned[key] = stripHtml(value[key]);
    }
    return cleaned;
  }
  return value;
}

/**
 * Middleware that deep-sanitizes req.body to prevent stored XSS.
 */
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = stripHtml(req.body);
  }
  next();
}

module.exports = { sanitizeBody };
