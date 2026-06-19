-- CampusMarket Supabase/Postgres schema.
-- Run this in the Supabase SQL editor before starting the Express API.

create extension if not exists citext;

create table if not exists users (
  user_id bigserial primary key,
  full_name text not null,
  email citext not null unique,
  password text,
  google_id text unique,
  avatar_url text,
  campus text,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_active boolean not null default true,
  occupation text not null default 'Student',
  phone_number text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  category_id bigserial primary key,
  name text not null unique,
  description text
);

insert into categories (name, description) values
  ('Books', 'Textbooks, guides, and reading material'),
  ('Notes', 'Class notes, summaries, and study packs'),
  ('Electronics', 'Calculators, gadgets, and accessories'),
  ('Stationery', 'Notebooks, drawing tools, and supplies'),
  ('Lab Equipment', 'Lab kits, instruments, and project gear'),
  ('Other', 'Other student essentials')
on conflict (name) do update
set description = excluded.description;

create table if not exists products (
  product_id bigserial primary key,
  seller_id bigint not null references users(user_id) on delete cascade,
  category_id bigint references categories(category_id) on delete set null,
  title text not null,
  description text,
  price numeric(12, 2) not null default 0 check (price >= 0),
  condition text not null default 'good' check (condition in ('new', 'good', 'fair', 'poor')),
  stock_qty integer not null default 1 check (stock_qty >= 0),
  campus text,
  is_available boolean not null default true,
  contact_preference text not null default 'In-app Message',
  created_at timestamptz not null default now()
);

create index if not exists idx_products_seller_id on products(seller_id);
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_available_created_at on products(is_available, created_at desc);

create table if not exists product_images (
  image_id bigserial primary key,
  product_id bigint not null references products(product_id) on delete cascade,
  image_url text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product_id on product_images(product_id);

create table if not exists carts (
  cart_id bigserial primary key,
  user_id bigint not null unique references users(user_id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists cart_items (
  cart_item_id bigserial primary key,
  cart_id bigint not null references carts(cart_id) on delete cascade,
  product_id bigint not null references products(product_id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  added_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create table if not exists orders (
  order_id bigserial primary key,
  buyer_id bigint not null references users(user_id) on delete cascade,
  total_amount numeric(12, 2) not null default 0 check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  placed_at timestamptz not null default now()
);

create index if not exists idx_orders_buyer_id on orders(buyer_id);
create index if not exists idx_orders_status on orders(status);

create table if not exists order_items (
  order_item_id bigserial primary key,
  order_id bigint not null references orders(order_id) on delete cascade,
  product_id bigint not null references products(product_id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0)
);

create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_product_id on order_items(product_id);

create table if not exists messages (
  message_id bigserial primary key,
  sender_id bigint not null references users(user_id) on delete cascade,
  receiver_id bigint not null references users(user_id) on delete cascade,
  product_id bigint references products(product_id) on delete set null,
  content text not null,
  is_read boolean not null default false,
  sent_at timestamptz not null default now(),
  check (sender_id <> receiver_id)
);

create index if not exists idx_messages_sender_id on messages(sender_id);
create index if not exists idx_messages_receiver_id on messages(receiver_id);
create index if not exists idx_messages_sent_at on messages(sent_at desc);

create table if not exists conversation_deletions (
  user_id bigint not null references users(user_id) on delete cascade,
  other_user_id bigint not null references users(user_id) on delete cascade,
  deleted_at timestamptz not null default now(),
  primary key (user_id, other_user_id),
  check (user_id <> other_user_id)
);

create index if not exists idx_conversation_deletions_user_deleted_at
on conversation_deletions(user_id, deleted_at desc);

create table if not exists reviews (
  review_id bigserial primary key,
  product_id bigint not null references products(product_id) on delete cascade,
  reviewer_id bigint not null references users(user_id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_product_id on reviews(product_id);
create index if not exists idx_reviews_reviewer_id on reviews(reviewer_id);

-- Supabase safety:
-- The React frontend uses the Express API, not direct Supabase table access.
-- Enable RLS with no public policies so anon/authenticated Supabase clients
-- cannot read or write these tables by default. The Express backend connects
-- with the database connection string and remains responsible for app auth.
alter table users enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table messages enable row level security;
alter table conversation_deletions enable row level security;
alter table reviews enable row level security;

create or replace view product_order_stats as
select
  oi.product_id,
  sum(oi.quantity) filter (where o.status in ('pending','confirmed','completed')) as sold_qty,
  sum(oi.quantity * oi.unit_price) filter (where o.status in ('pending','confirmed','completed')) as earned,
  count(*) filter (where o.status in ('pending','confirmed')) as open_orders
from order_items oi
join orders o on o.order_id = oi.order_id
group by oi.product_id;

create or replace view product_primary_images as
select distinct on (pi.product_id)
  pi.product_id,
  pi.image_url
from product_images pi
order by pi.product_id, pi.is_primary desc, pi.image_id asc;

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
