const express = require('express');
const Book = require('../models/booksModel');
const Reader = require('../models/readersModel');
const router = express.Router();

// Получить все книги
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 1001 });
  }
});

// Добавить книгу
router.post('/', async (req, res) => {
  try {
    const { title, author } = req.body;
    if(!title || !author) return res.status(400).json({ message: 0 });
    const existingTitle = await Book.findOne({ title });
    if (existingTitle) return res.status(400).json({ message: 1 });
    const book = new Book({ title, author, readers: [] });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 1000 });
  }
});

// Добавить читателя к книге
router.post('/:id/reader', async (req, res) => {
  try {
    console.log(req.body)
    const { lastname, days } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 2 });

    // const book = new Book({ title, author, readers: [] });
    const newReader = new Reader({ lastname, days });
    console.log(newReader)
    await newReader.save() 

    book.readers.push(newReader);
    await book.save();

    res.status(200).json({ message: 3 });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: 1002 });
  }
});

// Подсчет суммарного времени использования каждой книги
router.get('/:id/total-time', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 2 });

    const totalTime = book.readers.reduce((acc, reader) => acc + reader.daysBorrowed, 0);
    res.json({ totalTime });
  } catch (error) {
    res.status(500).json({ message: 1003 });
  }
});
module.exports = router;
