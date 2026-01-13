# Library REST API

A simple REST API for managing a library of books. **No database** - data is stored in memory.

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

The server will be available at: `http://localhost:3000`

**Note:** Data is stored in memory and will be lost when the server restarts.

## Testing

Run the test suite:

```bash
npm test
```

The tests use Jest and Supertest to test all API endpoints from an end-user perspective, including:
- Creating books
- Retrieving all books
- Retrieving a book by ID
- Updating books
- Deleting books
- Error handling (404 for non-existent books)
- Complete CRUD workflow

## API Endpoints

### POST `/books` - Add a book

**Request:**
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"name": "War and Peace", "author": "Leo Tolstoy", "year": "1869", "available": 3}'
```

**Response (201):**
```json
{
  "id": 1,
  "name": "War and Peace",
  "author": "Leo Tolstoy",
  "year": "1869",
  "available": 3
}
```

---

### GET `/books` - List all books

**Request:**
```bash
curl http://localhost:3000/books
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "War and Peace",
    "author": "Leo Tolstoy",
    "year": "1869",
    "available": 3
  },
  {
    "id": 2,
    "name": "1984",
    "author": "George Orwell",
    "year": "1949",
    "available": 5
  }
]
```

---

### GET `/books/:id` - Get book by ID

**Request:**
```bash
curl http://localhost:3000/books/1
```

**Response (200):**
```json
{
  "id": 1,
  "name": "War and Peace",
  "author": "Leo Tolstoy",
  "year": "1869",
  "available": 3
}
```

**Error Response (404):**
```json
{
  "error": "Book not found"
}
```

---

### PUT `/books/:id` - Update book

**Request:**
```bash
curl -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"available": 5}'
```

**Response (200):**
```json
{
  "id": 1,
  "name": "War and Peace",
  "author": "Leo Tolstoy",
  "year": "1869",
  "available": 5
}
```

**Error Response (404):**
```json
{
  "error": "Book not found"
}
```

---

### DELETE `/books/:id` - Delete book

**Request:**
```bash
curl -X DELETE http://localhost:3000/books/1
```

**Response (200):**
```json
{
  "message": "Book deleted",
  "book": {
    "id": 1,
    "name": "War and Peace",
    "author": "Leo Tolstoy",
    "year": "1869",
    "available": 3
  }
}
```

**Error Response (404):**
```json
{
  "error": "Book not found"
}
```

---

## Book Schema

```javascript
{
  id: Number,        // Automatically generated
  name: String,
  author: String,
  year: String,
  available: Number
}
```

## Project Structure

```
UbiApiLibrary/
├── index.js       
├── index.test.js  # Test suite
├── package.json   
└── README.md
```

## Dependencies

**Production:**
- **express** - Web framework

**Development:**
- **jest** - Testing framework
- **supertest** - HTTP assertion library for testing API endpoints

