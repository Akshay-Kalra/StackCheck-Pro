const { query } = require("../config/database");

async function create({ id, inputSummary, report }) {
  await query(
    `INSERT INTO audits (id, input_summary, report) VALUES ($1, $2, $3)`,
    [id, JSON.stringify(inputSummary), JSON.stringify(report)]
  );
}

async function findById(id) {
  const result = await query(
    `SELECT id, created_at, input_summary, report FROM audits WHERE id = $1`,
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    createdAt: row.created_at,
    inputSummary: row.input_summary,
    report: row.report,
  };
}

module.exports = { create, findById };
