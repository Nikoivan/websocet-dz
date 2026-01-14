import type { Book } from '../domain.js';

export abstract class BookRepository {
  private books: Book[] = [];

  public createBook(book: Book): void {
    this.books.push(book);
  }

  public getBook(id: string): Book | null {
    const book = this.books.find(book => book.id === id);

    return book || null;
  }

  public getBooks(): Book[] {
    return this.books;
  }

  updateBook(id: string, book: Book): void {
    const currentBook = this.getBook(id);

    if (!currentBook) {
      throw new Error('Book not found. Current id is missing');
    }

    const newBook = { ...currentBook, ...book };

    this.books = this.books.filter(book => book.id === id);

    this.books.push(newBook);
  }

  public deleteBook(id: string): void {
    const currentBook = this.getBook(id);

    if (!currentBook) {
      throw new Error('Book not found. Current id is missing');
    }

    this.books = this.books.filter(book => book.id === id);
  }
}
