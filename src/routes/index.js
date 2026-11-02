import { Router } from 'express';
import * as authors from '../controllers/authors.js';
import * as books from '../controllers/books.js';
import * as loans from '../controllers/loans.js';
import { Member } from '../models/index.js';

const router = Router();

router.get('/authors', authors.list);
router.post('/authors', authors.create);
router.get('/authors/:id', authors.get);
router.delete('/authors/:id', authors.remove);

router.get('/books', books.list);
router.post('/books', books.create);
router.get('/books/:id', books.get);

router.post('/members', async (req, res) => {
  const member = await Member.create({ name: req.body.name, email: req.body.email });
  res.status(201).json(member);
});
router.get('/members/:id/loans', loans.memberLoans);

router.post('/loans', loans.borrow);
router.patch('/loans/:id/return', loans.giveBack);

export default router;
