const { Pool } = require('pg');

const globalForDb = globalThis;

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  return new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });
}

const pool = globalForDb.__xavierPgPool || createPool();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__xavierPgPool = pool;
}

module.exports = { pool };
