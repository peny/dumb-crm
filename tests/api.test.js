const request = require('supertest');
const fastify = require('fastify');

describe('API Endpoints', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    await app.register(require('@fastify/cors'));
    await app.register(require('@fastify/cookie'));
    await app.register(require('@fastify/jwt'), {
      secret: 'test-secret'
    });
    
    // Register all routes
    await app.register(require('../routes/auth'), { prefix: '/api' });
    await app.register(require('../routes/users'), { prefix: '/api' });
    await app.register(require('../routes/customers'), { prefix: '/api' });
    await app.register(require('../routes/contacts'), { prefix: '/api' });
    await app.register(require('../routes/deals'), { prefix: '/api' });
    
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET / should return API info', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });
    
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('message', 'Dumb CRM API');
    expect(body).toHaveProperty('version', '1.0.0');
    expect(body).toHaveProperty('endpoints');
  });

  test('GET /health should return health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });
    
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('status', 'ok');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('uptime');
  });

  test('GET /api/customers should require authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/customers'
    });
    
    expect(response.statusCode).toBe(401);
  });

  test('GET /api/contacts should require authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/contacts'
    });
    
    expect(response.statusCode).toBe(401);
  });

  test('GET /api/deals should require authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/deals'
    });
    
    expect(response.statusCode).toBe(401);
  });
});
