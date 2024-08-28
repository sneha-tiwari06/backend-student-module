const Book = require('../models/book');
const BorrowedBook = require('../models/BorrowedBook');
const RequestedBook = require('../models/RequestedBook');
exports.getBooks = async (req, res) => {
  try {
    // Fetch all books
    const books = await Book.find({});

    // Fetch borrowed book details
    const borrowedBooks = await BorrowedBook.find({});

    // Create a map to easily find borrowed books
    const borrowedBooksMap = borrowedBooks.reduce((map, borrowed) => {
      map[borrowed.bookId] = borrowed;
      return map;
    }, {});

    // Add dateOfReturning from BorrowedBook to each book
    const booksWithReturnDates = books.map(book => {
      const borrowed = borrowedBooksMap[book._id];
      return {
        ...book.toObject(),
        dateOfReturning: borrowed ? borrowed.dateOfReturning : null
      };
    });

    res.json(booksWithReturnDates);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: 'An error occurred while fetching books.' });
  }
};
exports.borrowBook = async (req, res) => {
  try {
    const { bookId, studentName, rollNo, studentClass } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.quantity <= 0) {
      return res.status(400).json({ error: 'Book not available.' });
    }
    const existingBorrow = await BorrowedBook.findOne({
      bookId,
      rollNo,
      dateOfReturning: { $gte: new Date() }
    });
    if (existingBorrow) {
      return res.status(400).json({ error: 'Book already borrowed by this student.' });
    }
    const dateOfReturning = new Date();
    dateOfReturning.setDate(dateOfReturning.getDate() + 30);
    await BorrowedBook.create({
      bookId,
      studentName,
      rollNo,
      studentClass,
      dateOfReturning
    });
    await Book.findByIdAndUpdate(bookId, { $inc: { quantity: -1 } });
    res.json({ dateOfReturning });
  } catch (err) {
    console.error("Error borrowing book: ", err);
    res.status(500).json({ error: err.message });
  }
};
exports.returnBook = async (req, res) => {
  try {
    const { bookId, rollNo } = req.body;
    if (!bookId || !rollNo) {
      return res.status(400).json({ error: 'Book ID and Roll No are required.' });
    }
    const borrowedBook = await BorrowedBook.findOne({ bookId, rollNo, dateOfReturning: { $gte: new Date() } });
    if (!borrowedBook) {
      return res.status(400).json({ error: 'No record of this book being borrowed.' });
    }
    borrowedBook.dateOfReturning = new Date();
    await borrowedBook.save();
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(400).json({ error: 'Book not found.' });
    }
    book.quantity += 1;
    await book.save();
    res.status(200).json({ message: 'Book returned successfully.' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.requestBook = async (req, res) => {
  try {
    const { title, author, sname, rollNumber, classStudy } = req.body;
    const requestedBook = new RequestedBook({
      title,
      author,
      sname,
      rollNumber,
      class: classStudy,
    });
    await requestedBook.save();
    res.json(requestedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.addBook = async (req, res) => {
  try {
    const { title, author, studentClass, quantity, year } = req.body;
    const parsedQuantity = parseInt(quantity, 10);
    const newBook = new Book({
      title,
      author,
      class: studentClass,
      quantity: parsedQuantity,
      year,
      available: true,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
