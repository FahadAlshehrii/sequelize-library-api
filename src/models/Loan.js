import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Loan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bookId: { type: DataTypes.INTEGER, allowNull: false },
  memberId: { type: DataTypes.INTEGER, allowNull: false },
  borrowedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  returnedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'loans' });
