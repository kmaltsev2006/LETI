const express = require('express');
const path = require('path');

const app = express();

// Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const pagesRouter = require('./routes/pages');     // pages: /, /books/:id
const booksApiRouter = require('./routes/books'); // REST API: /api/books

app.use('/', pagesRouter);
app.use('/api/books', booksApiRouter);

// Launch
const PORT = 80;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
