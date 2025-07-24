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

// Fetch an author by ID
async function fetchAuthorById(req, res) {
  const { id } = req.params;
  try {
    const author = await AuthorModel.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }
    res.json(author);
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({
      error: error.message || 'Error retrieving the author.'
    });
  }
}

// Update an author
async function updateAuthor(req, res) {
  try {
    if (req.body.name === '') {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const { id } = req.params;
    const author = await AuthorModel.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const fields = ['name', 'companyName', 'description', 'photo'];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        author[field] = req.body[field];
      }
    });

    const updated = await author.save();
    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({
      error: error.message || 'Failed to update the author.'
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
  fetchAuthorById,
  updateAuthor,
  deleteAuthor
};
