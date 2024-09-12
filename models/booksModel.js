const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  author: String,
  readers: Array, // Список читателей книги
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
