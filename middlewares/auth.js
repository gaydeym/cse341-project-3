const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  let token = null;
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ error: 'You have to log-in first' });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET);
    req.userId = payload._id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
