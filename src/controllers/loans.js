import { Book, Loan, Member, sequelize } from '../models/index.js';
import { HttpError } from '../middlewares/errorHandler.js';

// POST /loans { bookId, memberId }
// A transaction: lock the book row, check a copy is free, create the loan.
export async function borrow(req, res) {
  const { bookId, memberId } = req.body;
  const loan = await sequelize.transaction(async (t) => {
    const book = await Book.findByPk(bookId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!book) throw new HttpError(404, 'book not found');
    const member = await Member.findByPk(memberId, { transaction: t });
    if (!member) throw new HttpError(404, 'member not found');

    const open = await Loan.count({ where: { bookId, returnedAt: null }, transaction: t });
    if (open >= book.copies) throw new HttpError(409, 'no copies available');

    return Loan.create({ bookId, memberId }, { transaction: t });
  });
  res.status(201).json(loan);
}

// PATCH /loans/:id/return
export async function giveBack(req, res) {
  const loan = await Loan.findByPk(req.params.id);
  if (!loan) throw new HttpError(404, 'loan not found');
  if (loan.returnedAt) throw new HttpError(409, 'already returned');
  await loan.update({ returnedAt: new Date() });
  res.json(loan);
}

// GET /members/:id/loans  (through the many-to-many association)
export async function memberLoans(req, res) {
  const member = await Member.findByPk(req.params.id, {
    include: [{ model: Book, as: 'books', through: { attributes: ['borrowedAt', 'returnedAt'] } }],
  });
  if (!member) throw new HttpError(404, 'member not found');
  res.json(member);
}
