const request = require("supertest")
const express = require("express")

// Mock the controller
const mockLoginController = {
  loginUser: jest.fn((req, res) => {
    if (req.body.email === "test@example.com" && req.body.password === "password") {
      res.status(200).json({ _id: "123", email: "test@example.com" })
    } else {
      res.status(401).json({ error: "Incorrect email or password." })
    }
  }),
}

jest.mock("../../controllers/login", () => mockLoginController)

describe("Login Routes", () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use("/login", require("../../routes/login"))

    jest.clearAllMocks()
  })

  describe("POST /login", () => {
    it("should handle login request", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password",
      }

      const response = await request(app).post("/login").send(loginData).expect(200)

      expect(mockLoginController.loginUser).toHaveBeenCalled()
      expect(response.body).toMatchObject({
        _id: "123",
        email: "test@example.com",
      })
    })

    it("should handle invalid login", async () => {
      const loginData = {
        email: "wrong@example.com",
        password: "wrongpassword",
      }

      const response = await request(app).post("/login").send(loginData).expect(401)

      expect(mockLoginController.loginUser).toHaveBeenCalled()
      expect(response.body).toEqual({ error: "Incorrect email or password." })
    })
  })
})
