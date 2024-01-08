import postgres from 'postgres';

const pgSqlClient = postgres({
  database: 'anchor',
  host: process.env['PG_DB_HOST'],
  user: 'postgres',
  password: process.env['PG_DB_PASSWORD'],
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pgSqlClient;
