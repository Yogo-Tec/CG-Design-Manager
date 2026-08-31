import pg from "pg";
import "dotenv/config";
import { readFileSync } from "node:fs";
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
export const databaseEnabled = Boolean(connectionString);
export const pool = databaseEnabled ? new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: true, ...(process.env.DATABASE_SSL_CA_PATH ? { ca: readFileSync(process.env.DATABASE_SSL_CA_PATH,"utf8") } : {}) },
  max: 10,
  idleTimeoutMillis: 30_000
}) : null;

export async function query(text, params = []) {
  if (!pool) throw new Error("Database is not configured");
  return pool.query(text, params);
}
