const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    companyName: {
      type: String
    },
    description: {
      type: String
    },
    photo: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Author', authorSchema);
