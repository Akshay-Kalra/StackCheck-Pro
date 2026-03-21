const { Pool } = require("pg");
const { DATABASE_URL } = require("./env");

const pool = new Pool({ connectionString: DATABASE_URL });

async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS audits (
      id UUID PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      input_summary JSONB NOT NULL,
      report JSONB NOT NULL
    );
  `);
  console.log("Database initialised.");
}

module.exports = { query, initDb };
