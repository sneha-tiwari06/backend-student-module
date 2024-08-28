const express = require('express');
const { getBooks, borrowBook, requestBook, addBook, returnBook } = require('../controller/library');
const router = express.Router();

router.get('/books', getBooks);
router.post('/borrow', borrowBook);
router.post('/request', requestBook);
router.post('/addBook', addBook);
router.post('/return', returnBook);

module.exports = router;
