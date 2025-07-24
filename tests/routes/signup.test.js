const request = require('supertest');
const express = require('express');

// Mock the controller
const mockSignupController = {
  signupUser: jest.fn((req, res) => {
    if (req.body.email && req.body.password) {
      res.status(201).json({
        _id: '123',
        email: req.body.email,
        token: 'mock-token'
      });
    } else {
      res.status(400).json({ error: 'All fields must be filled.' });
    }
  })
};

jest.mock('../../controllers/signup', () => mockSignupController);

describe('Signup Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/signup', require('../../routes/signup'));

    jest.clearAllMocks();
  });

  describe('POST /signup', () => {
    it('should handle signup request', async () => {
      const signupData = {
        email: 'test@example.com',
        password: 'StrongPassword123!'
      };

      const response = await request(app).post('/signup').send(signupData).expect(201);

      expect(mockSignupController.signupUser).toHaveBeenCalled();
      expect(response.body).toMatchObject({
        _id: '123',
        email: 'test@example.com',
        token: 'mock-token'
      });
    });

    it('should handle invalid signup data', async () => {
      const signupData = {
        email: '',
        password: ''
      };

      const response = await request(app).post('/signup').send(signupData).expect(400);

      expect(mockSignupController.signupUser).toHaveBeenCalled();
      expect(response.body).toEqual({ error: 'All fields must be filled.' });
    });
  });
});
