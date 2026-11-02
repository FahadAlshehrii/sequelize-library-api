import { Author, Book } from '../models/index.js';
import { HttpError } from '../middlewares/errorHandler.js';

export async function list(req, res) {
  const authors = await Author.findAll({ order: [['name', 'ASC']] });
  res.json(authors);
}

// eager loading: the author with its books in one query
export async function get(req, res) {
  const author = await Author.findByPk(req.params.id, {
    include: [{ model: Book, as: 'books', attributes: ['id', 'title', 'isbn', 'copies'] }],
  });
  if (!author) throw new HttpError(404, 'author not found');
  res.json(author);
}

export async function create(req, res) {
  const author = await Author.create({ name: req.body.name, country: req.body.country });
  res.status(201).json(author);
}

export async function remove(req, res) {
  const deleted = await Author.destroy({ where: { id: req.params.id } });
  if (!deleted) throw new HttpError(404, 'author not found');
  res.status(204).end();
}
