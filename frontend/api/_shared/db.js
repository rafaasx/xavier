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

function getPool() {
  if (globalForDb.__xavierPgPool) {
    return globalForDb.__xavierPgPool;
  }

  const pool = createPool();

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.__xavierPgPool = pool;
  }

  return pool;
}

module.exports = { getPool };
