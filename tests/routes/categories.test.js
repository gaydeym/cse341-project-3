const request = require('supertest');
const express = require('express');

// Mock the controller
const mockCategoriesController = {
  fetchCategories: jest.fn((req, res) => res.json([])),
  fetchCategoryById: jest.fn((req, res) => res.json({ id: req.params.id })),
  addCategory: jest.fn((req, res) => res.status(201).json({ id: '123', ...req.body })),
  updateCategory: jest.fn((req, res) => res.json({ id: req.params.id, ...req.body })),
  deleteCategory: jest.fn((req, res) => res.json({ message: 'Category deleted successfully.' })),
  validateId: jest.fn((req, res, next) => next())
};

// Mock the auth middleware
const mockVerifyToken = jest.fn((req, res, next) => {
  req.userId = 'test-user-id';
  next();
});

jest.mock('../../controllers/categories', () => mockCategoriesController);
jest.mock('../../middlewares/auth', () => mockVerifyToken);

describe('Categories Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/categories', require('../../routes/categories'));

    jest.clearAllMocks();
  });

  describe('GET /categories', () => {
    it('should fetch all categories', async () => {
      const response = await request(app).get('/categories').expect(200);

      expect(mockVerifyToken).toHaveBeenCalled();
      expect(mockCategoriesController.fetchCategories).toHaveBeenCalled();
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /categories/:id', () => {
    it('should fetch category by id', async () => {
      const categoryId = '507f1f77bcf86cd799439011';

      const response = await request(app).get(`/categories/${categoryId}`).expect(200);

      expect(mockVerifyToken).toHaveBeenCalled();
      expect(mockCategoriesController.validateId).toHaveBeenCalled();
      expect(mockCategoriesController.fetchCategoryById).toHaveBeenCalled();
      expect(response.body).toEqual({ id: categoryId });
    });
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'Desserts',
        description: 'Sweet treats and dessert recipes'
      };

      const response = await request(app).post('/categories').send(newCategory).expect(201);

      expect(mockVerifyToken).toHaveBeenCalled();
      expect(mockCategoriesController.addCategory).toHaveBeenCalled();
      expect(response.body).toMatchObject(newCategory);
    });
  });

  describe('PUT /categories/:id', () => {
    it('should update a category', async () => {
      const categoryId = '507f1f77bcf86cd799439011';
      const updateData = { name: 'Updated Category' };

      const response = await request(app)
        .put(`/categories/${categoryId}`)
        .send(updateData)
        .expect(200);

      expect(mockVerifyToken).toHaveBeenCalled();
      expect(mockCategoriesController.validateId).toHaveBeenCalled();
      expect(mockCategoriesController.updateCategory).toHaveBeenCalled();
      expect(response.body).toMatchObject(updateData);
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should delete a category', async () => {
      const categoryId = '507f1f77bcf86cd799439011';

      const response = await request(app).delete(`/categories/${categoryId}`).expect(200);

      expect(mockVerifyToken).toHaveBeenCalled();
      expect(mockCategoriesController.validateId).toHaveBeenCalled();
      expect(mockCategoriesController.deleteCategory).toHaveBeenCalled();
      expect(response.body).toEqual({ message: 'Category deleted successfully.' });
    });
  });
});
