const contactProcedures = require('../db/contacts');

// Contact routes
async function contactRoutes(fastify, options) {
  // GET /contacts - Get all contacts
  fastify.get('/contacts', async (request, reply) => {
    try {
      const contacts = await contactProcedures.getAll();
      return { success: true, data: contacts };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch contacts' };
    }
  });

  // GET /contacts/:id - Get contact by ID
  fastify.get('/contacts/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const contact = await contactProcedures.getById(id);
      
      if (!contact) {
        reply.code(404);
        return { success: false, error: 'Contact not found' };
      }
      
      return { success: true, data: contact };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch contact' };
    }
  });

  // GET /contacts/customer/:customerId - Get contacts by customer ID
  fastify.get('/contacts/customer/:customerId', async (request, reply) => {
    try {
      const { customerId } = request.params;
      const contacts = await contactProcedures.getByCustomerId(customerId);
      
      return { success: true, data: contacts };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { success: false, error: 'Failed to fetch contacts' };
    }
  });

  // POST /contacts - Create new contact
  fastify.post('/contacts', async (request, reply) => {
    try {
      const { customerId, name, email, phone, position } = request.body;
      
      // Basic validation
      if (!customerId || !name || !email) {
        reply.code(400);
        return { success: false, error: 'Customer ID, name, and email are required' };
      }

      const contact = await contactProcedures.create({
        customerId,
        name,
        email,
        phone,
        position
      });
      
      reply.code(201);
      return { success: true, data: contact };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2003') {
        reply.code(400);
        return { success: false, error: 'Invalid customer ID' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to create contact' };
    }
  });

  // PUT /contacts/:id - Update contact
  fastify.put('/contacts/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, email, phone, position } = request.body;
      
      // Basic validation
      if (!name || !email) {
        reply.code(400);
        return { success: false, error: 'Name and email are required' };
      }

      const contact = await contactProcedures.update(id, {
        name,
        email,
        phone,
        position
      });
      
      return { success: true, data: contact };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2025') {
        reply.code(404);
        return { success: false, error: 'Contact not found' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to update contact' };
    }
  });

  // DELETE /contacts/:id - Delete contact
  fastify.delete('/contacts/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      await contactProcedures.delete(id);
      
      return { success: true, message: 'Contact deleted successfully' };
    } catch (error) {
      fastify.log.error(error);
      
      if (error.code === 'P2025') {
        reply.code(404);
        return { success: false, error: 'Contact not found' };
      }
      
      reply.code(500);
      return { success: false, error: 'Failed to delete contact' };
    }
  });
}

module.exports = contactRoutes;
