const express = require("express")

jest.mock("../../routes/swagger", () => (req, res, next) => {
  if (req.path === "/api-docs") {
    res.json({ swagger: "docs" })
  } else {
    next()
  }
})

jest.mock("../../routes/recipes", () => (req, res, next) => {
  if (req.method === "GET" && req.path === "/") {
    res.json({ route: "recipes" })
  } else {
    next()
  }
})

jest.mock("../../routes/authors", () => (req, res, next) => {
  if (req.method === "GET" && req.path === "/") {
    res.json({ route: "authors" })
  } else {
    next()
  }
})

jest.mock("../../routes/categories", () => (req, res, next) => {
  if (req.method === "GET" && req.path === "/") {
    res.json({ route: "categories" })
  } else {
    next()
  }
})

jest.mock("../../routes/signup", () => (req, res, next) => {
  if (req.method === "POST" && req.path === "/") {
    res.json({ route: "signup" })
  } else {
    next()
  }
})

jest.mock("../../routes/login", () => (req, res, next) => {
  if (req.method === "POST" && req.path === "/") {
    res.json({ route: "login" })
  } else {
    next()
  }
})

describe("Index Routes", () => {
  it("should export a router", () => {
    const indexRouter = require("../../routes/index")
    expect(indexRouter).toBeDefined()
  })

  it("should have the correct structure", () => {
    const indexRouter = require("../../routes/index")
    expect(typeof indexRouter).toBe("function")
    expect(indexRouter.stack).toBeDefined()
  })
})
