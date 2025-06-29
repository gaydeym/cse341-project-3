const mongoose = require('mongoose');
const { recipe: RecipeModel } = require('../models');

// ID validation middleware
function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }
  next();
}

// Add a new recipe
async function addRecipe(req, res) {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const newRecipe = new RecipeModel(req.body);
    const saved = await newRecipe.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({
      error: error.message || 'Failed to save the recipe.'
    });
  }
}

// Fetch all recipes
async function fetchRecipes(req, res) {
  try {
    const recipes = await RecipeModel.find();
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      error: error.message || 'Could not retrieve recipes.'
    });
  }
}

// Fetch a recipe by ID
async function fetchRecipeById(req, res) {
  const { id } = req.params;

  try {
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({
      error: error.message || 'Error retrieving the recipe.'
    });
  }
}

// Update a recipe
async function updateRecipe(req, res) {
  try {
    if (req.body.name === '') {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const { id } = req.params;
    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const fields = [
      'name',
      'description',
      'author',
      'ingredients',
      'instructions',
      'equipment',
      'nutrition'
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        recipe[field] = req.body[field];
      }
    });

    const updated = await recipe.save();
    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({
      error: error.message || 'Failed to update the recipe.'
    });
  }
}

// Delete a recipe
async function deleteRecipe(req, res) {
  try {
    const { id } = req.params;
    const result = await RecipeModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully.' });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to delete the recipe.'
    });
  }
}

module.exports = {
  addRecipe,
  fetchRecipes,
  fetchRecipeById,
  updateRecipe,
  deleteRecipe,
  validateId
};
