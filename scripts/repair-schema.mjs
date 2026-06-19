import 'dotenv/config';
import { pool } from '../backend/db.js';

try {
  await pool.query(`
    create or replace view product_order_stats as
    select
      oi.product_id,
      sum(oi.quantity) filter (where o.status in ('pending','confirmed','completed')) as sold_qty,
      sum(oi.quantity * oi.unit_price) filter (where o.status in ('pending','confirmed','completed')) as earned,
      count(*) filter (where o.status in ('pending','confirmed')) as open_orders
    from order_items oi
    join orders o on o.order_id = oi.order_id
    group by oi.product_id;
  `);

  await pool.query(`
    create or replace view product_primary_images as
    select distinct on (pi.product_id)
      pi.product_id,
      pi.image_url
    from product_images pi
    order by pi.product_id, pi.is_primary desc, pi.image_id asc;
  `);

  await pool.query(`
    create or replace function prevent_negative_stock_qty()
    returns trigger language plpgsql as $$
    begin
      if new.stock_qty < 0 then
        raise exception 'stock_qty cannot be negative';
      end if;
      return new;
    end;
    $$;

    drop trigger if exists trg_prevent_negative_stock_qty on products;
    create trigger trg_prevent_negative_stock_qty
    before insert or update on products
    for each row execute function prevent_negative_stock_qty();
  `);

  console.log(JSON.stringify({ ok: true, repaired: ['product_order_stats', 'product_primary_images', 'trg_prevent_negative_stock_qty'] }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: String(error?.message || error) }, null, 2));
  process.exitCode = 1;
} finally {
  await pool.end();
}

