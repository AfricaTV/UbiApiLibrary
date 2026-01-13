const request = require('supertest');
const app = require('./index.js');

beforeEach(() => {
  app.resetState();
});

describe('Library REST API - End User Tests', () => {
  
  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Library REST API');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('POST /books');
    });
  });

  describe('POST /books', () => {
    test('should create a new book', async () => {
      const newBook = {
        name: '1984',
        author: 'George Orwell',
        year: '1949',
        available: 5
      };

      const response = await request(app)
        .post('/books')
        .send(newBook)
        .expect(201);
      
      expect(response.body).toMatchObject({
        id: 1,
        name: '1984',
        author: 'George Orwell',
        year: '1949',
        available: 5
      });
    });

    test('should assign unique IDs to books', async () => {
      const book1 = { name: 'Book 1', author: 'Author 1', year: '2000', available: 1 };
      const book2 = { name: 'Book 2', author: 'Author 2', year: '2001', available: 2 };

      const response1 = await request(app).post('/books').send(book1).expect(201);
      const response2 = await request(app).post('/books').send(book2).expect(201);

      expect(response1.body.id).toBe(1);
      expect(response2.body.id).toBe(2);
    });
  });

  describe('GET /books', () => {
    test('should return empty array when no books exist', async () => {
      const response = await request(app)
        .get('/books')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('should return all books', async () => {
      const book1 = { name: 'Book 1', author: 'Author 1', year: '2000', available: 1 };
      const book2 = { name: 'Book 2', author: 'Author 2', year: '2001', available: 2 };

      await request(app).post('/books').send(book1);
      await request(app).post('/books').send(book2);

      const response = await request(app)
        .get('/books')
        .expect(200);
      
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id', 1);
      expect(response.body[1]).toHaveProperty('id', 2);
    });
  });

  describe('GET /books/:id', () => {
    test('should return a book by ID', async () => {
      const newBook = { name: 'Test Book', author: 'Test Author', year: '2020', available: 3 };
      
      const createResponse = await request(app).post('/books').send(newBook);
      const bookId = createResponse.body.id;

      const response = await request(app)
        .get(`/books/${bookId}`)
        .expect(200);
      
      expect(response.body).toMatchObject({
        id: bookId,
        name: 'Test Book',
        author: 'Test Author',
        year: '2020',
        available: 3
      });
    });

    test('should return 404 for non-existent book', async () => {
      const response = await request(app)
        .get('/books/999')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Book not found');
    });
  });

  describe('PUT /books/:id', () => {
    test('should update an existing book', async () => {
      const newBook = { name: 'Original', author: 'Author', year: '2000', available: 1 };
      const createResponse = await request(app).post('/books').send(newBook);
      const bookId = createResponse.body.id;

      const updateData = { available: 10, name: 'Updated' };
      const response = await request(app)
        .put(`/books/${bookId}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body).toMatchObject({
        id: bookId,
        name: 'Updated',
        author: 'Author',
        year: '2000',
        available: 10
      });
    });

    test('should return 404 when updating non-existent book', async () => {
      const response = await request(app)
        .put('/books/999')
        .send({ available: 5 })
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Book not found');
    });
  });

  describe('DELETE /books/:id', () => {
    test('should delete an existing book', async () => {
      const newBook = { name: 'To Delete', author: 'Author', year: '2000', available: 1 };
      const createResponse = await request(app).post('/books').send(newBook);
      const bookId = createResponse.body.id;

      const response = await request(app)
        .delete(`/books/${bookId}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Book deleted');
      expect(response.body.book).toHaveProperty('id', bookId);

      await request(app)
        .get(`/books/${bookId}`)
        .expect(404);
    });

    test('should return 404 when deleting non-existent book', async () => {
      const response = await request(app)
        .delete('/books/999')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Book not found');
    });
  });

  describe('End-to-End Workflow', () => {
    test('complete CRUD workflow', async () => {
      // new book
      const newBook = {
        name: 'E2E Test Book',
        author: 'E2E Author',
        year: '2023',
        available: 5
      };
      const createResponse = await request(app)
        .post('/books')
        .send(newBook)
        .expect(201);
      
      const bookId = createResponse.body.id;

      // get all
      const getAllResponse = await request(app)
        .get('/books')
        .expect(200);
      expect(getAllResponse.body).toHaveLength(1);

      // get by id
      const getByIdResponse = await request(app)
        .get(`/books/${bookId}`)
        .expect(200);
      expect(getByIdResponse.body.name).toBe('E2E Test Book');

      // update
      const updateResponse = await request(app)
        .put(`/books/${bookId}`)
        .send({ available: 10 })
        .expect(200);
      expect(updateResponse.body.available).toBe(10);

      // delete
      await request(app)
        .delete(`/books/${bookId}`)
        .expect(200);

      await request(app)
        .get(`/books/${bookId}`)
        .expect(404);
    });
  });
});

