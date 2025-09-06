const userProcedures = require('../db/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Authentication middleware
async function authenticateToken(request, reply) {
  try {
    const token = request.cookies.token || request.headers.authorization?.replace('Bearer ', '');
    
    request.log.info('Auth middleware - Cookies:', request.cookies);
    request.log.info('Auth middleware - Headers:', request.headers);
    request.log.info('Auth middleware - Token found:', !!token);
    
    if (!token) {
      request.log.info('Auth middleware - No token found');
      reply.code(401);
      reply.send({ success: false, error: 'Access token required' });
      return;
    }

    const decoded = request.server.jwt.verify(token);
    request.log.info('Auth middleware - Token decoded:', decoded);
    
    const user = await userProcedures.getById(decoded.userId);
    request.log.info('Auth middleware - User found:', !!user);
    
    if (!user || !user.isActive) {
      request.log.info('Auth middleware - User invalid or inactive');
      reply.code(401);
      reply.send({ success: false, error: 'Invalid or inactive user' });
      return;
    }

    request.user = user;
    request.log.info('Auth middleware - Authentication successful');
  } catch (error) {
    request.log.error('Auth middleware - Error:', error.message);
    reply.code(401);
    reply.send({ success: false, error: 'Invalid token' });
  }
}

// Admin role middleware
async function requireAdmin(request, reply) {
  try {
    // First authenticate the user
    await authenticateToken(request, reply);
    
    // Check if user is admin
    if (request.user.role !== 'admin') {
      reply.code(403);
      reply.send({ success: false, error: 'Admin access required' });
      return;
    }
  } catch (error) {
    reply.code(403);
    reply.send({ success: false, error: 'Admin access required' });
  }
}

// Generate JWT token
function generateToken(request, user) {
  return request.server.jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    { expiresIn: '7d' }
  );
}

// Set authentication cookie
function setAuthCookie(reply, token) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  };
  
  reply.log.info('Setting cookie with options:', cookieOptions);
  reply.setCookie('token', token, cookieOptions);
}

// Clear authentication cookie
function clearAuthCookie(reply) {
  const cookieOptions = {
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  };
  
  reply.log.info('Clearing cookie with options:', cookieOptions);
  reply.clearCookie('token', cookieOptions);
}

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  JWT_SECRET
};
