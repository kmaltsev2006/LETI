const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/books.json');

async function readBooks() {
  return fs.readJson(dataPath);
}

async function writeBooks(data) {
  await fs.writeJson(dataPath, data, { spaces: 2 });
}

router.get('/', async (req, res) => {
  try {
    const books = await readBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error reading data' });
  }
});

router.post('/', async (req, res) => {
  try {
    const books = await readBooks();
    const { title, author, year } = req.body;
    const newBook = {
      id: Date.now(),
      title: title || 'Untitled',
      author: author || 'Unknown',
      year: year || '',
      available: true,
      borrower: '',
      dueDate: ''
    };
    books.push(newBook);
    await writeBooks(books);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: 'Error adding book' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const books = await readBooks();
    const idx = books.findIndex(b => b.id == req.params.id);
    if (idx === -1) return res.sendStatus(404);
    books[idx] = { ...books[idx], ...req.body };
    await writeBooks(books);
    res.json(books[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating book' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const books = await readBooks();
    const updated = books.filter(b => b.id != req.params.id);
    await writeBooks(updated);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error deleting book' });
  }
});

module.exports = router;