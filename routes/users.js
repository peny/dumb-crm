const userProcedures = require('../db/users');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// User management routes (admin only)
async function userRoutes(fastify, options) {
  // GET /users - Get all users (admin only)
  fastify.get('/users', {
    preHandler: [requireAdmin]
  }, async (request, reply) => {
    try {
      const users = await userProcedures.getAll();
      return { success: true, data: users };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch users' };
    }
  });

  // GET /users/:id - Get user by ID (admin only)
  fastify.get('/users/:id', {
    preHandler: [requireAdmin]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const user = await userProcedures.getById(id);
      
      if (!user) {
        reply.code(404);
        return { success: false, error: 'User not found' };
      }
      
      return { success: true, data: user };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch user' };
    }
  });

  // POST /users - Create new user (admin only)
  fastify.post('/users', {
    preHandler: [requireAdmin]
  }, async (request, reply) => {
    try {
      const { email, password, name, role, isActive } = request.body;
      
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

      // Validate role
      if (role && !['admin', 'user'].includes(role)) {
        reply.code(400);
        return { success: false, error: 'Invalid role. Must be admin or user' };
      }

      const user = await userProcedures.create({
        email,
        password,
        name,
        role: role || 'user',
        isActive: isActive !== undefined ? isActive : true
      });
      
      reply.code(201);
      return { success: true, data: user };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to create user' };
    }
  });

  // PUT /users/:id - Update user (admin only)
  fastify.put('/users/:id', {
    preHandler: [requireAdmin]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { email, password, name, role, isActive } = request.body;
      
      // Basic validation
      if (!name) {
        reply.code(400);
        return { success: false, error: 'Name is required' };
      }

      // Validate role
      if (role && !['admin', 'user'].includes(role)) {
        reply.code(400);
        return { success: false, error: 'Invalid role. Must be admin or user' };
      }

      // Check if email already exists (if changing email)
      if (email) {
        const existingUser = await userProcedures.getByEmail(email);
        if (existingUser && existingUser.id !== parseInt(id)) {
          reply.code(409);
          return { success: false, error: 'Email already exists' };
        }
      }

      const user = await userProcedures.update(id, {
        email,
        password,
        name,
        role,
        isActive
      });
      
      return { success: true, data: user };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2025') {
        reply.code(404);
        return { success: false, error: 'User not found' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to update user' };
    }
  });

  // DELETE /users/:id - Delete user (admin only)
  fastify.delete('/users/:id', {
    preHandler: [requireAdmin]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      // Prevent admin from deleting themselves
      if (parseInt(id) === request.user.id) {
        reply.code(400);
        return { success: false, error: 'Cannot delete your own account' };
      }

      await userProcedures.delete(id);
      
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2025') {
        reply.code(404);
        return { success: false, error: 'User not found' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to delete user' };
    }
  });

  // GET /users/stats - Get user statistics (admin only)
  fastify.get('/users/stats', {
    preHandler: [requireAdmin]
  }, async (request, reply) => {
    try {
      const stats = await userProcedures.getStats();
      return { success: true, data: stats };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch user statistics' };
    }
  });

  // POST /users/toggle-status - Toggle user active status (admin only)
  fastify.post('/users/:id/toggle-status', {
    preHandler: [requireAdmin]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      // Prevent admin from deactivating themselves
      if (parseInt(id) === request.user.id) {
        reply.code(400);
        return { success: false, error: 'Cannot deactivate your own account' };
      }

      const user = await userProcedures.getById(id);
      
      if (!user) {
        reply.code(404);
        return { success: false, error: 'User not found' };
      }

      const updatedUser = await userProcedures.update(id, {
        isActive: !user.isActive
      });
      
      return { 
        success: true, 
        data: updatedUser,
        message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to toggle user status' };
    }
  });
}

module.exports = userRoutes;
