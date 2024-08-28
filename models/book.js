const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  class: { type: String },
  quantity: { type: Number, required: true },
  year: { type: Number, required: true },
  available: { type: Boolean, default: true },
});
module.exports = mongoose.model('Book', BookSchema);
