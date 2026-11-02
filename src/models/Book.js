import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Book', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  authorId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
  isbn: { type: DataTypes.STRING(13), allowNull: false, unique: true, validate: { is: /^\d{10}(\d{3})?$/ } },
  publishedYear: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1450, max: 2100 } },
  copies: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 0 } },
}, { tableName: 'books' });
