const request = require("supertest")
const express = require("express")

// Mock swagger-ui-express
const mockSwaggerUi = {
  serve: jest.fn((req, res, next) => next()),
  setup: jest.fn(() => (req, res) => {
    res.json({ swagger: "UI setup" })
  }),
}

jest.mock("swagger-ui-express", () => mockSwaggerUi)

// Mock the swagger.json file
jest.mock("../../swagger.json", () => ({
  info: { title: "Test API" },
  paths: {},
}))

describe("Swagger Routes", () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use("/", require("../../routes/swagger"))

    jest.clearAllMocks()
  })

  describe("GET /api-docs", () => {
    it("should serve swagger documentation", async () => {
      const response = await request(app).get("/api-docs")

      expect(response.status).toBe(200)
      expect(mockSwaggerUi.serve).toHaveBeenCalled()
    })
  })

  it("should configure swagger UI middleware", () => {
    const swaggerRouter = require("../../routes/swagger")
    expect(swaggerRouter).toBeDefined()
    expect(typeof swaggerRouter).toBe("function")
  })
})
