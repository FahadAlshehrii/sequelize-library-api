import { Sequelize } from 'sequelize';
import config from '../config/database.js';
import defineAuthor from './Author.js';
import defineBook from './Book.js';
import defineMember from './Member.js';
import defineLoan from './Loan.js';

const env = process.env.NODE_ENV || 'development';
const { database, username, password, ...options } = config[env];

export const sequelize = new Sequelize(database, username, password, options);

export const Author = defineAuthor(sequelize);
export const Book = defineBook(sequelize);
export const Member = defineMember(sequelize);
export const Loan = defineLoan(sequelize);

// one-to-many
Author.hasMany(Book, { foreignKey: 'authorId', as: 'books', onDelete: 'RESTRICT' });
Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

// many-to-many through loans, plus direct access to the loan rows
Book.belongsToMany(Member, { through: Loan, foreignKey: 'bookId', otherKey: 'memberId', as: 'borrowers' });
Member.belongsToMany(Book, { through: Loan, foreignKey: 'memberId', otherKey: 'bookId', as: 'books' });
Book.hasMany(Loan, { foreignKey: 'bookId', as: 'loans' });
Member.hasMany(Loan, { foreignKey: 'memberId', as: 'loans' });
Loan.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
Loan.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
