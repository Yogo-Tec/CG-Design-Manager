import pg from "pg";
import "dotenv/config";
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
export const databaseEnabled = Boolean(connectionString);
export const pool = databaseEnabled ? new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30_000
}) : null;

export async function query(text, params = []) {
  if (!pool) throw new Error("Database is not configured");
  return pool.query(text, params);
}
