const mongoose = require('mongoose');

const returnedBookSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',  // Reference to the Book model
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  studentClass: {
    type: String,
    required: true
  },
  returnDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });  // Automatically adds `createdAt` and `updatedAt` fields

const ReturnedBook = mongoose.model('ReturnedBook', returnedBookSchema);

module.exports = ReturnedBook;
