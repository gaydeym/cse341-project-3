const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { user: UserModel } = require('../models');

// Create JSON Web Token
function createToken(_id) {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

// Signup handler
async function signupUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields must be filled.' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email is not valid.' });
    }

    // Validate password
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password is not strong enough.' });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new UserModel({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    // const userResponse = {
    //   _id: savedUser._id,
    //   email: savedUser.email,
    //   createdAt: savedUser.createdAt
    // };
    // res.status(201).json(userResponse);
    const token = createToken(savedUser._id);
    res.status(201).json({
      _id: savedUser._id,
      email: savedUser.email,
      token
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: error.message || 'Internal server error during signup.' });
  }
}

module.exports = {
  signupUser
};
