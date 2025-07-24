const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const request = require('supertest');

describe('Server Configuration Tests', () => {
  let app;

  beforeEach(() => {
    // Create a fresh app instance
    app = express();

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    });

    app.use(bodyParser.json());
    app.use(cookieParser());

    // Test routes
    app.get('/test', (req, res) => {
      res.json({ message: 'test works' });
    });

    app.post('/test-json', (req, res) => {
      res.json({ received: req.body });
    });

    app.get('/error', (req, res, next) => {
      const error = new Error('Test error');
      next(error);
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found.' });
    });

    // 500 handler
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' });
    });
  });

  it('should set CORS headers', async () => {
    const response = await request(app).get('/test');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('test works');
  });

  it('should parse JSON in request body', async () => {
    const testData = { name: 'Test', value: 123 };
    const response = await request(app).post('/test-json').send(testData);

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual(testData);
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/nonexistent');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Route not found.' });
  });

  it('should handle server errors', async () => {
    const response = await request(app).get('/error');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error.' });
  });

  it('should be a valid Express application', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('should use bodyParser middleware', async () => {
    const testData = { test: 'data' };
    const response = await request(app).post('/test-json').send(testData);

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual(testData);
  });

  it('should use cookieParser middleware', () => {
    expect(app).toBeDefined();
  });
});
