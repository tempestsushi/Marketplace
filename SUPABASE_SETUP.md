# Supabase Backend Setup

This project keeps the existing Express API and connects it to Supabase Postgres with `pg`.

## 1) Create The Database Tables

Open your Supabase project, go to **SQL Editor**, and run:

`backend/schema.sql`

That creates the tables, category seed data, views, indexes, and stock trigger expected by the backend.

## 2) Add The Connection String

In the root `.env`, use your Supabase Postgres connection string:

```env
SUPABASE_DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require"
```

`DATABASE_URL` also works if you prefer that name.

## 3) Enable Image Uploads

In Supabase, go to **Storage** and create two public buckets:

- `product-images`
- `profile-images`

Then add these backend-only values to `.env`:

```env
SUPABASE_URL="https://PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Keep `SUPABASE_SERVICE_ROLE_KEY` secret. Do not expose it in frontend code.

## 4) Check The Connection

```bash
npm run check:db
npm run check:schema
```

You should see `{ "ok": true, ... }`.

## 5) Start The App

```bash
npm run dev
```

Frontend calls still go to `/api/...`; Vite proxies those requests to the Express backend on port `8787`.

