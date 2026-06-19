# CampusMarket

CampusMarket is a campus marketplace web app where students can list items, browse products, buy through a cart/order flow, message buyers or sellers, upload product/profile images, and manage listings from a dashboard. It also includes an admin area for managing users and products.

The app uses a React frontend, an Express backend, and Supabase for Postgres database hosting and image storage.

## Features

- User registration, login, logout, and Google sign-in
- Session authentication using an HTTP-only cookie
- Public product browsing with search, filters, categories, and detail pages
- Seller listing management: create, edit, and delete products
- Product image uploads through Supabase Storage
- Profile editing with avatar upload
- Cart and checkout flow
- Buyer/seller orders with cancel and complete actions
- In-app messaging linked to products
- Per-user chat deletion, which hides a conversation only for the user who deletes it
- Reviews for products
- Admin panel for user/product moderation
- Supabase/Postgres schema with tables, indexes, views, and RLS enabled

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Lucide React icons

### Backend

- Node.js
- Express 5
- PostgreSQL via `pg`
- Supabase
- JWT sessions
- HTTP-only cookies
- Google auth verification with `google-auth-library`
- Password hashing with `bcryptjs`

### Database And Storage

- Supabase Postgres
- Supabase Storage buckets:
  - `product-images`
  - `profile-images`

## Project Structure

```text
backend/
  index.js              Express app entry point
  db.js                 Postgres connection pool
  auth.js               JWT/session helpers and route guards
  schema.sql            Supabase/Postgres schema
  queries/              SQL query builders
  routes/               API route modules

frontend/
  src/
    api/                Frontend API clients
    components/         Shared UI components
    context/            Auth and favorites providers
    pages/              App pages
    constants/          Listing/category constants
    utils/              Formatting helpers

scripts/
  check-db.mjs          Database connection check
  check-schema.mjs      Required schema/view check
  repair-schema.mjs     Recreates required views/triggers
  free-dev-ports.mjs    Frees local dev ports before startup
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root. Use `.env.example` as the template.

Required values:

```env
SUPABASE_DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:5432/postgres?sslmode=require"
SUPABASE_URL="https://PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
JWT_SECRET="your-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
PORT=8787
COOKIE_SECURE=false
```

Do not commit real `.env` values.

### 3. Set up Supabase

In Supabase SQL Editor, run:

```text
backend/schema.sql
```

Then create these public Storage buckets:

- `product-images`
- `profile-images`

More details are in `SUPABASE_SETUP.md`.

### 4. Check the database

```bash
npm run check:db
npm run check:schema
```

If schema views or triggers are missing, run:

```bash
npm run repair:schema
```

### 5. Start development

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8787/api`

### 6. Build frontend

```bash
npm run build
```

## Frontend Routes

| Route            | Access      | Purpose                                      |
| ---------------- | ----------- | -------------------------------------------- |
| `/`              | Public      | Home page with featured marketplace sections |
| `/login`         | Public      | Email/password and Google login              |
| `/register`      | Public      | New account registration                     |
| `/listings`      | Public      | Browse/search/filter listings                |
| `/listings/:id`  | Public      | Product detail page                          |
| `/sell`          | User only   | Create a new listing                         |
| `/sell/:id/edit` | Owner/admin | Edit an existing listing                     |
| `/dashboard`     | User only   | Profile and seller listing dashboard         |
| `/cart`          | User only   | Cart page                                    |
| `/messages`      | User only   | Buyer/seller conversations                   |
| `/orders`        | User only   | Buyer/seller order management                |
| `/admin`         | Admin only  | Admin management panel                       |
| `*`              | Public      | Not found page                               |

## Backend API Routes

All API routes are mounted under `/api`.

### Auth And Profile

| Method  | Route            | Purpose                    |
| ------- | ---------------- | -------------------------- |
| `POST`  | `/auth/register` | Register a user            |
| `POST`  | `/auth/login`    | Login with email/password  |
| `POST`  | `/auth/google`   | Login/register with Google |
| `GET`   | `/auth/me`       | Read current session user  |
| `POST`  | `/auth/logout`   | Clear session cookie       |
| `GET`   | `/my/profile`    | Fetch current user profile |
| `PATCH` | `/my/profile`    | Update profile fields      |

### Catalog And Products

| Method   | Route           | Purpose                             |
| -------- | --------------- | ----------------------------------- |
| `GET`    | `/categories`   | List categories                     |
| `GET`    | `/products`     | Public product listing with filters |
| `GET`    | `/products/:id` | Product detail                      |
| `GET`    | `/my/products`  | Current user's listings             |
| `POST`   | `/products`     | Create product                      |
| `PATCH`  | `/products/:id` | Update product                      |
| `DELETE` | `/products/:id` | Delete product                      |

### Cart And Orders

| Method   | Route                     | Purpose                     |
| -------- | ------------------------- | --------------------------- |
| `GET`    | `/cart`                   | Fetch current user's cart   |
| `POST`   | `/cart/items`             | Add item to cart            |
| `PATCH`  | `/cart/items/:cartItemId` | Update cart quantity        |
| `DELETE` | `/cart/items/:cartItemId` | Remove cart item            |
| `POST`   | `/orders/checkout`        | Create order from cart      |
| `GET`    | `/my/orders`              | List buyer/seller orders    |
| `POST`   | `/orders/:id/cancel`      | Cancel an open order        |
| `POST`   | `/orders/:id/complete`    | Seller marks order complete |

### Messages And Notifications

| Method   | Route                                     | Purpose                                  |
| -------- | ----------------------------------------- | ---------------------------------------- |
| `POST`   | `/messages`                               | Send a message                           |
| `GET`    | `/my/messages`                            | Fetch current user's visible messages    |
| `POST`   | `/my/messages/mark-read`                  | Mark a message as read                   |
| `DELETE` | `/my/messages/conversations/:otherUserId` | Hide a conversation for the current user |
| `GET`    | `/notifications`                          | Unread message and open order counts     |

### Reviews

| Method | Route                   | Purpose         |
| ------ | ----------------------- | --------------- |
| `GET`  | `/products/:id/reviews` | Product reviews |
| `POST` | `/products/:id/reviews` | Create review   |

### Uploads

| Method | Route            | Purpose                                          |
| ------ | ---------------- | ------------------------------------------------ |
| `POST` | `/uploads/image` | Upload product/profile image to Supabase Storage |

### Admin

| Method   | Route                    | Purpose                |
| -------- | ------------------------ | ---------------------- |
| `GET`    | `/admin/overview`        | Admin dashboard counts |
| `GET`    | `/admin/users`           | List users             |
| `PATCH`  | `/admin/users/:id/block` | Block/unblock user     |
| `DELETE` | `/admin/users/:id`       | Delete user            |
| `GET`    | `/admin/products`        | List products          |
| `DELETE` | `/admin/products/:id`    | Delete product         |

## Database Overview

Main tables:

- `users`
- `categories`
- `products`
- `product_images`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `messages`
- `conversation_deletions`
- `reviews`

Important views:

- `product_order_stats`
- `product_primary_images`

The schema enables Row Level Security on tables. The React app does not access Supabase tables directly; it calls the Express API. The backend uses the database connection string and applies app-level authentication/authorization.

## Image Upload Flow

1. Frontend converts selected image files to data URLs.
2. Frontend sends the image to `POST /api/uploads/image`.
3. Backend validates file type and size.
4. Backend uploads to Supabase Storage using the service role key.
5. The public Storage URL is saved on the user profile or product image table.

## Auth And Sessions

- The backend signs JWTs.
- The JWT is stored in an HTTP-only `session` cookie.
- Frontend requests use `credentials: include`.
- Protected routes use `ProtectedRoute` on the frontend and `requireUser`/`requireAdmin` on the backend.

## GitHub Notes

Do commit:

- `README.md`
- `LICENSE`
- `.env.example`
- source files in `backend/`, `frontend/src/`, and `scripts/`
- `package.json`
- `package-lock.json`
- `backend/schema.sql`
- setup docs such as `SUPABASE_SETUP.md`

Do not commit:

- `.env`
- `node_modules/`
- `frontend/dist/`
- `.codex-*.log`
- other local logs or temporary files

Before pushing, check:

```bash
git status
git add README.md .gitignore .env.example package.json package-lock.json backend frontend scripts SUPABASE_SETUP.md BEGINNER_GUIDE.md
git status
```

Review the staged files carefully before committing.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
