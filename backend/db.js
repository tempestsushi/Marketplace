import pg from 'pg';

const { Pool } = pg;

export const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  process.env.POSTGRES_URL ||
  '';

function shouldUseSsl(connectionString) {
  if (!connectionString) return false;
  const lower = connectionString.toLowerCase();
  return lower.includes('sslmode=require') ||
    lower.includes('supabase.co') ||
    lower.includes('pooler.supabase.com');
}

function getPoolConnectionString(connectionString) {
  if (!connectionString || !shouldUseSsl(connectionString)) return connectionString;
  try {
    const url = new URL(connectionString);
    url.searchParams.delete('sslmode');
    return url.toString();
  } catch {
    return connectionString.replace(/[?&]sslmode=[^&]+/, (match) => match.startsWith('?') ? '?' : '');
  }
}

export const pool = new Pool({
  connectionString: getPoolConnectionString(databaseUrl),
  ssl: shouldUseSsl(databaseUrl)
    ? { rejectUnauthorized: false }
    : undefined,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 10000),
});
