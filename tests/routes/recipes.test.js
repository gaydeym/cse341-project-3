const request = require("supertest")
const express = require("express")

// Mock the controller
const mockRecipesController = {
  fetchRecipes: jest.fn((req, res) => res.json([])),
  fetchRecipeById: jest.fn((req, res) => res.json({ id: req.params.id })),
  addRecipe: jest.fn((req, res) => res.status(201).json({ id: "123", ...req.body })),
  updateRecipe: jest.fn((req, res) => res.json({ id: req.params.id, ...req.body })),
  deleteRecipe: jest.fn((req, res) => res.json({ message: "Recipe deleted successfully." })),
  validateId: jest.fn((req, res, next) => next()),
}

// Mock the auth middleware
const mockVerifyToken = jest.fn((req, res, next) => {
  req.userId = "test-user-id"
  next()
})

jest.mock("../../controllers/recipes", () => mockRecipesController)
jest.mock("../../middlewares/auth", () => mockVerifyToken)

describe("Recipes Routes", () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use("/recipes", require("../../routes/recipes"))

    jest.clearAllMocks()
  })

  describe("GET /recipes", () => {
    it("should fetch all recipes", async () => {
      const response = await request(app).get("/recipes").expect(200)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockRecipesController.fetchRecipes).toHaveBeenCalled()
      expect(response.body).toEqual([])
    })
  })

  describe("GET /recipes/:id", () => {
    it("should fetch recipe by id", async () => {
      const recipeId = "507f1f77bcf86cd799439011"

      const response = await request(app).get(`/recipes/${recipeId}`).expect(200)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockRecipesController.validateId).toHaveBeenCalled()
      expect(mockRecipesController.fetchRecipeById).toHaveBeenCalled()
      expect(response.body).toEqual({ id: recipeId })
    })
  })

  describe("POST /recipes", () => {
    it("should create a new recipe", async () => {
      const newRecipe = {
        name: "Test Recipe",
        description: "A test recipe",
        ingredients: ["ingredient1", "ingredient2"],
      }

      const response = await request(app).post("/recipes").send(newRecipe).expect(201)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockRecipesController.addRecipe).toHaveBeenCalled()
      expect(response.body).toMatchObject(newRecipe)
    })
  })

  describe("PUT /recipes/:id", () => {
    it("should update a recipe", async () => {
      const recipeId = "507f1f77bcf86cd799439011"
      const updateData = { name: "Updated Recipe" }

      const response = await request(app).put(`/recipes/${recipeId}`).send(updateData).expect(200)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockRecipesController.validateId).toHaveBeenCalled()
      expect(mockRecipesController.updateRecipe).toHaveBeenCalled()
      expect(response.body).toMatchObject(updateData)
    })
  })

  describe("DELETE /recipes/:id", () => {
    it("should delete a recipe", async () => {
      const recipeId = "507f1f77bcf86cd799439011"

      const response = await request(app).delete(`/recipes/${recipeId}`).expect(200)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockRecipesController.validateId).toHaveBeenCalled()
      expect(mockRecipesController.deleteRecipe).toHaveBeenCalled()
      expect(response.body).toEqual({ message: "Recipe deleted successfully." })
    })
  })
})
