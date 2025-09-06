const dealProcedures = require('../db/deals');
const { authenticateToken } = require('../middleware/auth');

// Deal routes
async function dealRoutes(fastify, options) {
  // GET /deals - Get all deals
  fastify.get('/deals', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const deals = await dealProcedures.getAll();
      return { success: true, data: deals };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch deals' };
    }
  });

  // GET /deals/:id - Get deal by ID
  fastify.get('/deals/:id', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const deal = await dealProcedures.getById(id);
      
      if (!deal) {
        reply.code(404);
        return { success: false, error: 'Deal not found' };
      }
      
      return { success: true, data: deal };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch deal' };
    }
  });

  // GET /deals/customer/:customerId - Get deals by customer ID
  fastify.get('/deals/customer/:customerId', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { customerId } = request.params;
      const deals = await dealProcedures.getByCustomerId(customerId);
      
      return { success: true, data: deals };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch deals' };
    }
  });

  // GET /deals/status/:status - Get deals by status
  fastify.get('/deals/status/:status', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { status } = request.params;
      const deals = await dealProcedures.getByStatus(status);
      
      return { success: true, data: deals };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch deals' };
    }
  });

  // GET /deals/stats - Get deal statistics
  fastify.get('/deals/stats', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const stats = await dealProcedures.getStats();
      return { success: true, data: stats };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch deal statistics' };
    }
  });

  // POST /deals - Create new deal
  fastify.post('/deals', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { customerId, title, description, value, status } = request.body;
      
      // Basic validation
      if (!customerId || !title || !value) {
        reply.code(400);
        return { success: false, error: 'Customer ID, title, and value are required' };
      }

      if (isNaN(value) || parseFloat(value) < 0) {
        reply.code(400);
        return { success: false, error: 'Value must be a positive number' };
      }

      const deal = await dealProcedures.create({
        customerId,
        title,
        description,
        value,
        status
      });
      
      reply.code(201);
      return { success: true, data: deal };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2003') {
        reply.code(400);
        return { success: false, error: 'Invalid customer ID' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to create deal' };
    }
  });

  // PUT /deals/:id - Update deal
  fastify.put('/deals/:id', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { title, description, value, status } = request.body;
      
      // Basic validation
      if (!title || !value) {
        reply.code(400);
        return { success: false, error: 'Title and value are required' };
      }

      if (isNaN(value) || parseFloat(value) < 0) {
        reply.code(400);
        return { success: false, error: 'Value must be a positive number' };
      }

      const deal = await dealProcedures.update(id, {
        title,
        description,
        value,
        status
      });
      
      return { success: true, data: deal };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2025') {
        reply.code(404);
        return { success: false, error: 'Deal not found' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to update deal' };
    }
  });

  // DELETE /deals/:id - Delete deal
  fastify.delete('/deals/:id', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      await dealProcedures.delete(id);
      
      return { success: true, message: 'Deal deleted successfully' };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2025') {
        reply.code(404);
        return { success: false, error: 'Deal not found' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to delete deal' };
    }
  });
}

module.exports = dealRoutes;
