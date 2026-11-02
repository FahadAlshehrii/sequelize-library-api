import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Member', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
  email: { type: DataTypes.TEXT, allowNull: false, unique: true, validate: { isEmail: true } },
}, { tableName: 'members' });
