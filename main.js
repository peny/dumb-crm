require('dotenv').config();

const fastify = require('fastify')({
  logger: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV === 'development'
  }
});

// Register CORS
fastify.register(require('@fastify/cors'), {
  origin: true
});

// Register routes
fastify.register(require('./routes/customers'), { prefix: '/api' });
fastify.register(require('./routes/contacts'), { prefix: '/api' });
fastify.register(require('./routes/deals'), { prefix: '/api' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  return {
    message: 'Dumb CRM API',
    version: '1.0.0',
    endpoints: {
      customers: '/api/customers',
      contacts: '/api/contacts',
      deals: '/api/deals',
      health: '/health'
    }
  };
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Server is running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
