const mongoose = require('mongoose');

const RequestedBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  class: { type: String, required: true },
});

module.exports = mongoose.model('RequestedBook', RequestedBookSchema);
