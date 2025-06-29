const mongoose = require('mongoose');
const { author: AuthorModel } = require('../models');

// ID validation middleware
function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid author ID' });
  }
  next();
}

// Add a new author
async function addAuthor(req, res) {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const newAuthor = new AuthorModel(req.body);
    const saved = await newAuthor.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({
      error: error.message || 'Failed to save the author.'
    });
  }
}

// Fetch all authors
async function fetchAuthors(req, res) {
  try {
    const authors = await AuthorModel.find();
    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({
      error: error.message || 'Could not retrieve authors.'
    });
  }
}

// Delete an author
async function deleteAuthor(req, res) {
  try {
    const { id } = req.params;
    const result = await AuthorModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    res.status(200).json({ message: 'Author deleted successfully.' });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to delete the author.'
    });
  }
}

module.exports = {
  validateId,
  addAuthor,
  fetchAuthors,
  deleteAuthor
};
