import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Author', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
  country: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'authors' });
