import { Router } from 'express';

import { mockDb } from '../../db/mock-db.js';

export const bookRouter = Router();

bookRouter.get('/', (req, res) => {
  const books = mockDb.book.getBooks();
  res.render('book/index', {
    title: 'Книга',
    books,
  });
});

bookRouter.get('/create', (req, res) => {
  res.render('book/create', {
    title: 'Book | Create',
    book: {},
  });
});

bookRouter.post('/create', (req, res) => {
  const { book } = req.body;

  mockDb.book.createBook(book);

  res.redirect('/books');
});

bookRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const book = mockDb.book.getUniqBook(id);

  if (!book) {
    res.redirect('/404');
  }

  res.render('book/view', {
    title: book?.title,
    book,
  });
});

bookRouter.get('/update/:id', (req, res) => {
  const { id } = req.params;
  const book = mockDb.book.getUniqBook(id);

  if (!book) {
    res.redirect('/404');
  }

  res.render('book/update', {
    title: 'Book | view',
    book: book,
  });
});

bookRouter.post('/update/:id', (req, res) => {
  const book = req.body;

  const updatedBook = mockDb.book.updateBook(book);

  if (!updatedBook) {
    res.redirect('/404');
  }

  res.redirect(`/books/${updatedBook.id}`);
});

bookRouter.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  const deletedBook = mockDb.book.deleteBook(id);

  if (!deletedBook) {
    res.redirect('/404');
  }

  res.redirect(`/books`);
});
