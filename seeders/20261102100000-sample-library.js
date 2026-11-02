'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('authors', [
      { id: 1, name: 'Naguib Mahfouz', country: 'Egypt' },
      { id: 2, name: 'Abdul Rahman Munif', country: 'Saudi Arabia' },
    ]);
    await queryInterface.bulkInsert('books', [
      { author_id: 1, title: 'Palace Walk', isbn: '9780385264662', published_year: 1956, copies: 2 },
      { author_id: 1, title: 'The Thief and the Dogs', isbn: '9780385264624', published_year: 1961, copies: 1 },
      { author_id: 2, title: 'Cities of Salt', isbn: '9780394755267', published_year: 1984, copies: 3 },
    ]);
    await queryInterface.bulkInsert('members', [
      { name: 'Fahad', email: 'fahad@example.com' },
    ]);
    await queryInterface.sequelize.query('SELECT setval(\'authors_id_seq\', (SELECT max(id) FROM authors))');
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('loans', null, {});
    await queryInterface.bulkDelete('members', null, {});
    await queryInterface.bulkDelete('books', null, {});
    await queryInterface.bulkDelete('authors', null, {});
  },
};
