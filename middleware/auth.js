const jwt = require('jsonwebtoken');
const JWT_SECRET = 'u9#kjJ8z!kXP?bRg7z!dTwr@2Tx+4';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request
    req.userRole = decoded.userRole; // Attach userRole to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;


