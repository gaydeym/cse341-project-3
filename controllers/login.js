const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { user: UserModel } = require('../models');

const isProduction = process.env.NODE_ENV === 'production';

// Create JSON Web Token
function createToken(_id) {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

// Login handler
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields must be filled.' });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const token = createToken(user._id);
    res
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // min*sec*mill 15min
        secure: isProduction
      })
      .status(200)
      .json({
        _id: user._id,
        email: user.email
      });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message || 'Internal server error during login.' });
  }
}

// Delete user handler
async function deleteUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "All fields must be filled." });
    }

    // Find user
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    // Delete the user
    const result = await UserModel.deleteOne({ _id: user._id });

    if (result.deletedCount === 0) {
      return res.status(500).json({ error: "Failed to delete user." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).json({ error: error.message || "Internal server error during user deletion." });
  }
}

module.exports = {
  loginUser,
  deleteUser
};
