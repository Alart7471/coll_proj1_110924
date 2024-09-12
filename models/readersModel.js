const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
  lastname: { type: String, required: true },
  days: { type: Number, required: true },
});

const Readers = mongoose.model('Readers', readerSchema);

module.exports = Readers;