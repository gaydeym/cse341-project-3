const mongoose = require("mongoose")
const { category: CategoryModel } = require("../models")

// ID validation middleware
function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid category ID" })
  }
  next()
}

// Add a new category
async function addCategory(req, res) {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Name cannot be empty" })
    }

    if (!req.body.description) {
      return res.status(400).json({ error: "Description cannot be empty" })
    }

    const newCategory = new CategoryModel(req.body)
    const saved = await newCategory.save()
    res.status(201).json(saved)
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({
      error: error.message || "Failed to save the category.",
    })
  }
}

// Fetch all categories
async function fetchCategories(req, res) {
  try {
    const categories = await CategoryModel.find()
    res.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({
      error: error.message || "Could not retrieve categories.",
    })
  }
}

// Fetch a category by ID
async function fetchCategoryById(req, res) {
  const { id } = req.params
  try {
    const category = await CategoryModel.findById(id)
    if (!category) {
      return res.status(404).json({ message: "Category not found." })
    }
    res.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    res.status(500).json({
      error: error.message || "Error retrieving the category.",
    })
  }
}

// Update a category
async function updateCategory(req, res) {
  try {
    if (req.body.name === "") {
      return res.status(400).json({ error: "Name cannot be empty" })
    }

    if (req.body.description === "") {
      return res.status(400).json({ error: "Description cannot be empty" })
    }

    const { id } = req.params
    const category = await CategoryModel.findById(id)
    if (!category) {
      return res.status(404).json({ message: "Category not found." })
    }

    const fields = ["name", "description"]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        category[field] = req.body[field]
      }
    })

    const updated = await category.save()
    res.status(200).json(updated)
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({
      error: error.message || "Failed to update the category.",
    })
  }
}

// Delete a category
async function deleteCategory(req, res) {
  try {
    const { id } = req.params
    const result = await CategoryModel.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found." })
    }
    res.status(200).json({ message: "Category deleted successfully." })
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to delete the category.",
    })
  }
}

module.exports = {
  validateId,
  addCategory,
  fetchCategories,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
}
