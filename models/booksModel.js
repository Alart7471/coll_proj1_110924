const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
  lastName: String,
  daysBorrowed: Number,
});

const bookSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  author: String,
  readers: [readerSchema], // Список читателей книги
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
