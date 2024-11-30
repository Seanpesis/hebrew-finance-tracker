const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers);
    
    // Check for token in different places
    let token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.body.token || 
                req.query.token;
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'אין הרשאה - נדרשת התחברות' });
    }

    // Clean the token
    token = token.trim();
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    console.log('Token being verified:', token.substring(0, 10) + '...');
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'exists' : 'missing');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);

    if (!decoded.id) {
      throw new Error('Token invalid - no user ID');
    }

    req.user = { 
      _id: decoded.id,  // Add _id for Mongoose queries
      id: decoded.id    // Keep id for backward compatibility
    };
    
    console.log('User set in request:', req.user);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    
    // More specific error messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'טוקן לא תקין' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'פג תוקף החיבור - נא להתחבר מחדש' });
    }
    
    res.status(401).json({ 
      message: 'אין הרשאה - נדרשת התחברות',
      error: error.message 
    });
  }
};

module.exports = auth;
