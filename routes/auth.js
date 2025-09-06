const userProcedures = require('../db/users');
const { 
  generateToken, 
  setAuthCookie, 
  clearAuthCookie, 
  authenticateToken 
} = require('../middleware/auth');

// Authentication routes
async function authRoutes(fastify, options) {
  // POST /auth/login - User login
  fastify.post('/auth/login', async (request, reply) => {
    try {
      const { email, password } = request.body;
      
      // Basic validation
      if (!email || !password) {
        reply.code(400);
        return { success: false, error: 'Email and password are required' };
      }

      // Find user by email
      const user = await userProcedures.getByEmail(email);
      
      if (!user) {
        reply.code(401);
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if user is active
      if (!user.isActive) {
        reply.code(401);
        return { success: false, error: 'Account is deactivated' };
      }

      // Verify password
      const isValidPassword = await userProcedures.verifyPassword(password, user.password);
      
      if (!isValidPassword) {
        reply.code(401);
        return { success: false, error: 'Invalid credentials' };
      }

      // Generate token
      const token = generateToken(request, user);
      
      // Set cookie
      setAuthCookie(reply, token);

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token
        }
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Login failed' };
    }
  });

  // POST /auth/register - User registration (admin only)
  fastify.post('/auth/register', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      // Check if user is admin
      if (request.user.role !== 'admin') {
        reply.code(403);
        return { success: false, error: 'Admin access required' };
      }

      const { email, password, name, role } = request.body;
      
      // Basic validation
      if (!email || !password || !name) {
        reply.code(400);
        return { success: false, error: 'Email, password, and name are required' };
      }

      // Check if email already exists
      const emailExists = await userProcedures.emailExists(email);
      if (emailExists) {
        reply.code(409);
        return { success: false, error: 'Email already exists' };
      }

      // Create user
      const user = await userProcedures.create({
        email,
        password,
        name,
        role: role || 'user'
      });

      return {
        success: true,
        data: user
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Registration failed' };
    }
  });

  // POST /auth/logout - User logout
  fastify.post('/auth/logout', async (request, reply) => {
    try {
      clearAuthCookie(reply);
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Logout failed' };
    }
  });

  // GET /auth/me - Get current user
  fastify.get('/auth/me', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      return {
        success: true,
        data: request.user
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to get user data' };
    }
  });

  // POST /auth/change-password - Change password
  fastify.post('/auth/change-password', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { currentPassword, newPassword } = request.body;
      
      if (!currentPassword || !newPassword) {
        reply.code(400);
        return { success: false, error: 'Current and new passwords are required' };
      }

      // Get user with password
      const user = await userProcedures.getByEmail(request.user.email);
      
      // Verify current password
      const isValidPassword = await userProcedures.verifyPassword(currentPassword, user.password);
      
      if (!isValidPassword) {
        reply.code(401);
        return { success: false, error: 'Current password is incorrect' };
      }

      // Update password
      await userProcedures.update(user.id, { password: newPassword });

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to change password' };
    }
  });
}

module.exports = authRoutes;
