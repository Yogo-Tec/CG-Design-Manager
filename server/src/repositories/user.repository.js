import bcrypt from "bcryptjs";
import { databaseEnabled, query } from "../config/database.js";

const demoUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "admin@cgdm.local",
  display_name: "Arjun Kumar",
  role: "ADMIN",
  status: "ACTIVE"
};
const demoHash = bcrypt.hashSync("admin123", 12);

export const userRepository = {
  async findByEmail(email) {
    if (!databaseEnabled) return email === demoUser.email ? { ...demoUser, password_hash: demoHash } : null;
    const result = await query(
      `SELECT id, email, password_hash, display_name, role, status
       FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`, [email]
    );
    return result.rows[0] || null;
  },
  async recordLogin(id) {
    if (!databaseEnabled) return;
    await query("UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1", [id]);
  }
};
