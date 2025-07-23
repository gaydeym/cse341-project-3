const request = require("supertest")
const express = require("express")

// Mock the controller
const mockAuthorsController = {
  fetchAuthors: jest.fn((req, res) => res.json([])),
  fetchAuthorById: jest.fn((req, res) => res.json({ id: req.params.id })),
  addAuthor: jest.fn((req, res) => res.status(201).json({ id: "123", ...req.body })),
  updateAuthor: jest.fn((req, res) => res.json({ id: req.params.id, ...req.body })),
  deleteAuthor: jest.fn((req, res) => res.json({ message: "Author deleted successfully." })),
  validateId: jest.fn((req, res, next) => next()),
}

// Mock the auth middleware
const mockVerifyToken = jest.fn((req, res, next) => {
  req.userId = "test-user-id"
  next()
})

jest.mock("../../controllers/authors", () => mockAuthorsController)
jest.mock("../../middlewares/auth", () => mockVerifyToken)

describe("Authors Routes", () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use("/authors", require("../../routes/authors"))

    jest.clearAllMocks()
  })

  describe("GET /authors", () => {
    it("should fetch all authors", async () => {
      const response = await request(app).get("/authors").expect(200)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockAuthorsController.fetchAuthors).toHaveBeenCalled()
      expect(response.body).toEqual([])
    })
  })

  describe("GET /authors/:id", () => {
    it("should fetch author by id", async () => {
      const authorId = "507f1f77bcf86cd799439011"

      const response = await request(app).get(`/authors/${authorId}`).expect(200)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockAuthorsController.validateId).toHaveBeenCalled()
      expect(mockAuthorsController.fetchAuthorById).toHaveBeenCalled()
      expect(response.body).toEqual({ id: authorId })
    })
  })

  describe("POST /authors", () => {
    it("should create a new author", async () => {
      const newAuthor = {
        name: "John Doe",
        companyName: "Test Company",
        description: "Test description",
      }

      const response = await request(app).post("/authors").send(newAuthor).expect(201)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockAuthorsController.addAuthor).toHaveBeenCalled()
      expect(response.body).toMatchObject(newAuthor)
    })
  })

  describe("PUT /authors/:id", () => {
    it("should update an author", async () => {
      const authorId = "507f1f77bcf86cd799439011"
      const updateData = { name: "Updated Name" }

      const response = await request(app).put(`/authors/${authorId}`).send(updateData).expect(200)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockAuthorsController.validateId).toHaveBeenCalled()
      expect(mockAuthorsController.updateAuthor).toHaveBeenCalled()
      expect(response.body).toMatchObject(updateData)
    })
  })

  describe("DELETE /authors/:id", () => {
    it("should delete an author", async () => {
      const authorId = "507f1f77bcf86cd799439011"

      const response = await request(app).delete(`/authors/${authorId}`).expect(200)

      expect(mockVerifyToken).toHaveBeenCalled()
      expect(mockAuthorsController.validateId).toHaveBeenCalled()
      expect(mockAuthorsController.deleteAuthor).toHaveBeenCalled()
      expect(response.body).toEqual({ message: "Author deleted successfully." })
    })
  })
})
