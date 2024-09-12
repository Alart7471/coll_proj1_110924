const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
  lastName: String,
  daysBorrowed: Number,
});

const bookSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  author: String,
  readers: Array, // Список читателей книги
});

const Readers = mongoose.model('Readers', readerSchema);
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
