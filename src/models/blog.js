const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  image:       { type: String },
  description: { type: String, required: true },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Blog', blogSchema);
