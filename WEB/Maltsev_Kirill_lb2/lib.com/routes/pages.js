const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/books.json');

router.get('/', async (req, res) => {
  try {
    const books = await fs.readJson(dataPath);
    res.render('index', { books });
  } catch (err) {
    res.status(500).send('Error reading data');
  }
});

// HTML-page of book card
router.get('/books/:id', async (req, res) => {
  try {
    const books = await fs.readJson(dataPath);
    const book = books.find(b => b.id == req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.render('book', { book });
  } catch (err) {
    res.status(500).send('Error reading data');
  }
});

module.exports = router;