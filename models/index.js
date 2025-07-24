const dbConfig = require('../db/db.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.recipe = require('./recipes.js');
db.author = require('./authors.js');
db.user = require('./users.js');
db.category = require('./categories.js');

module.exports = db;
