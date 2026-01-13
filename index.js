const express = require('express');

const app = express();
app.use(express.json());

let books = [];
let nextId = 1;

function resetState() {
  books = [];
  nextId = 1;
}

// get
app.get('/', (req, res) => {
  res.json({
    message: 'Library REST API',
    endpoints: {
      'POST /books': 'Add a new book',
      'GET /books': 'Get all books',
      'GET /books/:id': 'Get book by ID',
      'PUT /books/:id': 'Update book',
      'DELETE /books/:id': 'Delete book'
    }
  });
});

// post
app.post('/books', (req, res) => {
  const book = {
    id: nextId++,
    name: req.body.name,
    author: req.body.author,
    year: req.body.year,
    available: req.body.available
  };
  books.push(book);
  res.status(201).json(book);
});

// get-all
app.get('/books', (req, res) => {
  res.json(books);
});

// get-by-id
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// put
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });
  
  books[bookIndex] = { ...books[bookIndex], ...req.body };
  res.json(books[bookIndex]);
});

// delete
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });
  
  const deletedBook = books.splice(bookIndex, 1)[0];
  res.json({ message: 'Book deleted', book: deletedBook });
});

const PORT = 3000;

// export and reset
module.exports = app;
module.exports.resetState = resetState;

// check server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
