const request = require('supertest');
const fastify = require('fastify');

// Mock the database
jest.mock('../db/users', () => ({
  getByEmail: jest.fn(),
  verifyPassword: jest.fn(),
  createDefaultAdmin: jest.fn()
}));

describe('Authentication', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    await app.register(require('@fastify/cors'));
    await app.register(require('@fastify/cookie'));
    await app.register(require('@fastify/jwt'), {
      secret: 'test-secret'
    });
    await app.register(require('../routes/auth'), { prefix: '/api' });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /health should return 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });
    
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('status', 'ok');
  });

  test('POST /api/auth/login should require email and password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {}
    });
    
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('success', false);
  });

  test('GET /api/auth/me should require authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/me'
    });
    
    expect(response.statusCode).toBe(401);
  });

  test('POST /api/auth/logout should return success', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/logout'
    });
    
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('success', true);
  });
});
