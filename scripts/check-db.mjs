import 'dotenv/config';
import { pool, databaseUrl } from '../backend/db.js';

if (!databaseUrl) {
  console.error('Missing DATABASE_URL or SUPABASE_DATABASE_URL.');
  process.exitCode = 1;
} else {
  try {
    const { rows } = await pool.query('select current_database() as database, current_user as user, now() as checked_at;');
    console.log(JSON.stringify({ ok: true, ...rows[0] }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: String(error?.message || error) }, null, 2));
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

