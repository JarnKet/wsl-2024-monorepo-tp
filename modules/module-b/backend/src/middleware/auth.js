/**
 * Authentication middleware
 */
const requireAuth = (req, res, next) => {
  if (!req.session.authenticated) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

module.exports = {
  requireAuth
};
