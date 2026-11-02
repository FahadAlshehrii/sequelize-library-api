'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'authors', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      title: { type: Sequelize.TEXT, allowNull: false },
      isbn: { type: Sequelize.STRING(13), allowNull: false, unique: true },
      published_year: { type: Sequelize.INTEGER, allowNull: true },
      copies: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
    });
    await queryInterface.addIndex('books', ['author_id'], { name: 'books_author_id_idx' });
    await queryInterface.sequelize.query(
      'ALTER TABLE books ADD CONSTRAINT books_copies_check CHECK (copies >= 0)',
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('books');
  },
};
