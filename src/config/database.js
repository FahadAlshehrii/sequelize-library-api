// Used by the app (src/models/index.js) and by sequelize-cli.
const base = {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  define: { underscored: true },
};

export default {
  development: { ...base, database: process.env.POSTGRES_DB || 'library_dev' },
  test: { ...base, database: process.env.POSTGRES_DB_TEST || 'library_test', logging: false },
  production: { ...base, database: process.env.POSTGRES_DB, logging: false },
};
