import pg from "pg";
import "dotenv/config";
import { readFileSync } from "node:fs";
const { Pool } = pg;

function buildConnectionString() {
  if (!process.env.DATABASE_URL) return "";
  const url = new URL(process.env.DATABASE_URL);
  if (process.env.DATABASE_HOST) url.hostname = process.env.DATABASE_HOST;
  if (process.env.DATABASE_PORT) url.port = process.env.DATABASE_PORT;
  if (process.env.DATABASE_USER) url.username = process.env.DATABASE_USER;
  return url.toString();
}
const connectionString = buildConnectionString();
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
