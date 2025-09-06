require('dotenv').config();

const fastify = require('fastify')({
  logger: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV === 'development'
  }
});

// Register CORS
fastify.register(require('@fastify/cors'), {
  origin: ['https://dumb-crm-frontend.onrender.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
});

// Register cookie support
fastify.register(require('@fastify/cookie'));

// Register JWT
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
});

// Register routes
fastify.register(require('./routes/auth'), { prefix: '/api' });
fastify.register(require('./routes/users'), { prefix: '/api' });
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
      auth: '/api/auth',
      users: '/api/users',
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
    // Initialize default admin user if no users exist
    const userProcedures = require('./db/users');
    const defaultAdmin = await userProcedures.createDefaultAdmin();
    
    if (defaultAdmin) {
      fastify.log.info('Default admin user created:');
      fastify.log.info(`Email: ${defaultAdmin.email}`);
      fastify.log.info('Password: admin123');
      fastify.log.info('Please change the password after first login!');
    }

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
