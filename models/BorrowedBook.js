const mongoose = require('mongoose');

const BorrowedBookSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  studentClass: { type: String, required: true },
  dateOfBorrowing: { type: Date, default: Date.now },
  dateOfReturning: { type: Date },
});

module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);
