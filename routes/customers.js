const customerProcedures = require('../db/customers');
const { authenticateToken } = require('../middleware/auth');

// Customer routes
async function customerRoutes(fastify, options) {
  // GET /customers - Get all customers
  fastify.get('/customers', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const customers = await customerProcedures.getAll();
      return { success: true, data: customers };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch customers' };
    }
  });

  // GET /customers/:id - Get customer by ID
  fastify.get('/customers/:id', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const customer = await customerProcedures.getById(id);
      
      if (!customer) {
        reply.code(404);
        return { success: false, error: 'Customer not found' };
      }
      
      return { success: true, data: customer };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch customer' };
    }
  });

  // POST /customers - Create new customer
  fastify.post('/customers', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { name, email, phone, company } = request.body;
      
      // Basic validation
      if (!name || !email) {
        reply.code(400);
        return { success: false, error: 'Name and email are required' };
      }

      const customer = await customerProcedures.create({
        name,
        email,
        phone,
        company
      });
      
      reply.code(201);
      return { success: true, data: customer };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2002') {
        reply.code(409);
        return { success: false, error: 'Email already exists' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to create customer' };
    }
  });

  // PUT /customers/:id - Update customer
  fastify.put('/customers/:id', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, email, phone, company } = request.body;
      
      // Basic validation
      if (!name || !email) {
        reply.code(400);
        return { success: false, error: 'Name and email are required' };
      }

      const customer = await customerProcedures.update(id, {
        name,
        email,
        phone,
        company
      });
      
      return { success: true, data: customer };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2025') {
        reply.code(404);
        return { success: false, error: 'Customer not found' };
      }
      
      if (error.code === 'P2002') {
        reply.code(409);
        return { success: false, error: 'Email already exists' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to update customer' };
    }
  });

  // DELETE /customers/:id - Delete customer
  fastify.delete('/customers/:id', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      await customerProcedures.delete(id);
      
      return { success: true, message: 'Customer deleted successfully' };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2025') {
        reply.code(404);
        return { success: false, error: 'Customer not found' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to delete customer' };
    }
  });

  // GET /customers/search?q=query - Search customers
  fastify.get('/customers/search', {
    preHandler: [authenticateToken]
  }, async (request, reply) => {
    try {
      const { q } = request.query;
      
      if (!q) {
        reply.code(400);
        return { success: false, error: 'Search query is required' };
      }

      const customers = await customerProcedures.search(q);
      return { success: true, data: customers };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to search customers' };
    }
  });
}

module.exports = customerRoutes;
