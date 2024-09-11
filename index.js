const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const booksRouter = require('./routers/booksRouter');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'client')))


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/books', booksRouter);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
