import 'dotenv/config';
import { pool } from '../backend/db.js';

const expectedTables = [
  'users',
  'categories',
  'products',
  'product_images',
  'carts',
  'cart_items',
  'orders',
  'order_items',
  'messages',
  'reviews',
];

const expectedViews = [
  'product_order_stats',
  'product_primary_images',
];

try {
  const tablesRes = await pool.query(
    `
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name = any($1::text[])
    order by table_name;
    `,
    [expectedTables]
  );

  const viewsRes = await pool.query(
    `
    select table_name
    from information_schema.views
    where table_schema = 'public'
      and table_name = any($1::text[])
    order by table_name;
    `,
    [expectedViews]
  );

  const foundTables = new Set(tablesRes.rows.map((row) => row.table_name));
  const foundViews = new Set(viewsRes.rows.map((row) => row.table_name));
  const missingTables = expectedTables.filter((table) => !foundTables.has(table));
  const missingViews = expectedViews.filter((view) => !foundViews.has(view));
  const ok = missingTables.length === 0 && missingViews.length === 0;

  console.log(JSON.stringify({
    ok,
    tables: { found: [...foundTables], missing: missingTables },
    views: { found: [...foundViews], missing: missingViews },
  }, null, 2));

  if (!ok) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: String(error?.message || error) }, null, 2));
  process.exitCode = 1;
} finally {
  await pool.end();
}
