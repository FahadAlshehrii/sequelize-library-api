// Runs against the library_test database (npm test migrates it first).
import request from 'supertest';
import app from '../src/app.js';
import { sequelize, Author, Book, Member, Loan } from '../src/models/index.js';

beforeEach(async () => {
  await Loan.destroy({ where: {} });
  await Member.destroy({ where: {} });
  await Book.destroy({ where: {} });
  await Author.destroy({ where: {} });
});

afterAll(() => sequelize.close());

const makeAuthor = (name = 'Naguib Mahfouz') => request(app).post('/api/authors').send({ name, country: 'Egypt' });
const makeBook = (authorId, extra = {}) =>
  request(app).post('/api/books').send({ authorId, title: 'Palace Walk', isbn: '9780385264662', copies: 1, ...extra });

describe('authors and books (one-to-many)', () => {
  it('creates an author and lists its books in one request', async () => {
    const author = (await makeAuthor()).body;
    await makeBook(author.id);
    await makeBook(author.id, { title: 'Midaq Alley', isbn: '9780385264624' });

    const res = await request(app).get(`/api/authors/${author.id}`);
    expect(res.status).toBe(200);
    expect(res.body.books.map((b) => b.title).sort()).toEqual(['Midaq Alley', 'Palace Walk']);
  });

  it('rejects invalid data with 400 (validation) and duplicates (unique)', async () => {
    const author = (await makeAuthor()).body;
    expect((await makeBook(author.id, { isbn: 'abc' })).status).toBe(400);
    expect((await makeBook(author.id)).status).toBe(201);
    expect((await makeBook(author.id)).status).toBe(400);
    expect((await makeAuthor()).status).toBe(400);
  });

  it('cannot delete an author who still has books (foreign key)', async () => {
    const author = (await makeAuthor()).body;
    await makeBook(author.id);
    expect((await request(app).delete(`/api/authors/${author.id}`)).status).toBe(409);
    await Book.destroy({ where: {} });
    expect((await request(app).delete(`/api/authors/${author.id}`)).status).toBe(204);
  });

  it('filters and paginates books', async () => {
    const author = (await makeAuthor()).body;
    await makeBook(author.id, { title: 'Cities of Salt', isbn: '9780394755267' });
    await makeBook(author.id, { title: 'Palace Walk', isbn: '9780385264662' });
    const res = await request(app).get('/api/books?q=salt&limit=1');
    expect(res.body.total).toBe(1);
    expect(res.body.items[0].author.name).toBe('Naguib Mahfouz');
  });
});

describe('loans (many-to-many + transaction)', () => {
  it('lends a book until the copies run out, then returns it', async () => {
    const author = (await makeAuthor()).body;
    const book = (await makeBook(author.id, { copies: 1 })).body;
    const fahad = (await request(app).post('/api/members').send({ name: 'Fahad', email: 'f@example.com' })).body;
    const sara = (await request(app).post('/api/members').send({ name: 'Sara', email: 's@example.com' })).body;

    const first = await request(app).post('/api/loans').send({ bookId: book.id, memberId: fahad.id });
    expect(first.status).toBe(201);
    const second = await request(app).post('/api/loans').send({ bookId: book.id, memberId: sara.id });
    expect(second.status).toBe(409);

    const mine = await request(app).get(`/api/members/${fahad.id}/loans`);
    expect(mine.body.books[0].Loan.returnedAt).toBeNull();

    expect((await request(app).patch(`/api/loans/${first.body.id}/return`)).status).toBe(200);
    expect((await request(app).post('/api/loans').send({ bookId: book.id, memberId: sara.id })).status).toBe(201);
  });

  it('returns 404 for unknown book or member', async () => {
    expect((await request(app).post('/api/loans').send({ bookId: 999, memberId: 999 })).status).toBe(404);
  });
});
