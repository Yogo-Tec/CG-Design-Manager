import { pool, query } from "../src/config/database.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run user:make-admin -- user@example.com");
  process.exitCode = 1;
} else {
  try {
    const result = await query(
      `UPDATE auth.users
       SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"ADMIN"}'::jsonb,
           updated_at = NOW()
       WHERE LOWER(email) = $1
       RETURNING id, email, raw_app_meta_data->>'role' AS role`,
      [email]
    );

    if (result.rowCount !== 1) {
      throw new Error(`No Supabase Auth user found for ${email}`);
    }

    console.log(JSON.stringify({ email: result.rows[0].email, role: result.rows[0].role }));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await pool?.end();
  }
}
