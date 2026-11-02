import { Op } from 'sequelize';
import { Author, Book } from '../models/index.js';
import { HttpError } from '../middlewares/errorHandler.js';

// GET /books?q=salt&page=1&limit=10  (filter + pagination)
export async function list(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const where = req.query.q ? { title: { [Op.iLike]: `%${req.query.q}%` } } : {};
  const { rows, count } = await Book.findAndCountAll({
    where,
    include: [{ model: Author, as: 'author', attributes: ['id', 'name'] }],
    order: [['title', 'ASC']],
    limit,
    offset: (page - 1) * limit,
  });
  res.json({ page, limit, total: count, items: rows });
}

export async function get(req, res) {
  const book = await Book.findByPk(req.params.id, { include: [{ model: Author, as: 'author' }] });
  if (!book) throw new HttpError(404, 'book not found');
  res.json(book);
}

export async function create(req, res) {
  const { authorId, title, isbn, publishedYear, copies } = req.body;
  const book = await Book.create({ authorId, title, isbn, publishedYear, copies });
  res.status(201).json(book);
}
