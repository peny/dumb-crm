const userProcedures = require('../db/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Authentication middleware
async function authenticateToken(request, reply) {
  try {
    const token = request.cookies.token || request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      reply.code(401);
      reply.send({ success: false, error: 'Access token required' });
      return;
    }

    const decoded = request.server.jwt.verify(token);
    const user = await userProcedures.getById(decoded.userId);
    
    if (!user || !user.isActive) {
      reply.code(401);
      reply.send({ success: false, error: 'Invalid or inactive user' });
      return;
    }

    request.user = user;
  } catch (error) {
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
  reply.setCookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
}

// Clear authentication cookie
function clearAuthCookie(reply) {
  reply.clearCookie('token', { path: '/' });
}

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  JWT_SECRET
};
