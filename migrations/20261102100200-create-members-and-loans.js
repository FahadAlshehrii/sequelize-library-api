'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('members', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        name: { type: Sequelize.TEXT, allowNull: false },
        email: { type: Sequelize.TEXT, allowNull: false, unique: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      }, { transaction });

      // A loan links one member to one book (many-to-many through this table).
      await queryInterface.createTable('loans', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        book_id: {
          type: Sequelize.INTEGER, allowNull: false,
          references: { model: 'books', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE',
        },
        member_id: {
          type: Sequelize.INTEGER, allowNull: false,
          references: { model: 'members', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE',
        },
        borrowed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
        returned_at: { type: Sequelize.DATE, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      }, { transaction });

      await queryInterface.addIndex('loans', ['member_id'], { name: 'loans_member_id_idx', transaction });
      // one open loan per book per member
      await queryInterface.addIndex('loans', ['book_id', 'member_id'], {
        name: 'loans_open_book_member_key', unique: true, where: { returned_at: null }, transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('loans');
    await queryInterface.dropTable('members');
  },
};
