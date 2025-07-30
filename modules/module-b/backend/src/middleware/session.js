const cookie = require('cookie');
const crypto = require('crypto');

// Simple in-memory session store
const sessions = new Map();

// Session configuration
const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || 'wsc2024-secret-key',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  cookieName: 'sessionId'
};

/**
 * Generate a session ID
 */
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Sign a value with HMAC
 */
function sign(value, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('hex');
}

/**
 * Create session middleware
 */
function createSessionMiddleware() {
  return (req, res, next) => {
    // Parse cookies from request
    const cookies = cookie.parse(req.headers.cookie || '');
    const sessionId = cookies[SESSION_CONFIG.cookieName];

    // Initialize session object
    req.session = {};

    // Load existing session if valid
    if (sessionId && sessions.has(sessionId)) {
      const sessionData = sessions.get(sessionId);

      // Check if session is expired
      if (sessionData.expires > Date.now()) {
        req.session = { ...sessionData.data };
        req.sessionId = sessionId;
      } else {
        // Remove expired session
        sessions.delete(sessionId);
      }
    }

    // Method to save session
    req.session.save = () => {
      if (!req.sessionId) {
        req.sessionId = generateSessionId();
      }

      const sessionData = {
        data: { ...req.session },
        expires: Date.now() + SESSION_CONFIG.maxAge
      };

      // Remove the save method from stored data
      delete sessionData.data.save;
      delete sessionData.data.destroy;

      sessions.set(req.sessionId, sessionData);

      // Set cookie
      const cookieValue = cookie.serialize(SESSION_CONFIG.cookieName, req.sessionId, {
        maxAge: SESSION_CONFIG.maxAge / 1000, // Convert to seconds
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax'
      });

      res.setHeader('Set-Cookie', cookieValue);
    };

    // Method to destroy session
    req.session.destroy = () => {
      if (req.sessionId) {
        sessions.delete(req.sessionId);
      }

      // Clear cookie
      const cookieValue = cookie.serialize(SESSION_CONFIG.cookieName, '', {
        maxAge: 0,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      });

      res.setHeader('Set-Cookie', cookieValue);

      req.session = {};
      req.sessionId = null;
    };

    next();
  };
}

module.exports = createSessionMiddleware;
