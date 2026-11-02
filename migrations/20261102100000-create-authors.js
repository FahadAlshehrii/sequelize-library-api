'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('authors', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: Sequelize.TEXT, allowNull: false },
      country: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
    });
    await queryInterface.addConstraint('authors', {
      type: 'unique', fields: ['name'], name: 'authors_name_key',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('authors');
  },
};
