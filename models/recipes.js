const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema(
  {
    imgUrl: { type: String },
    name: { type: String, required: true },
    rating: { type: String },
    description: { type: String },
    author: {
      name: { type: String },
      url: { type: String }
    },
    cookTime: { type: String },
    ingredients: [String],
    instructions: [String],
    equipment: [String],
    nutrition: {
      protein: String,
      fiber: String,
      calories: String,
      fat: String,
      carbohydrates: String,
      sodium: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
