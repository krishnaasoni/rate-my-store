# RateMyStore

RateMyStore is a full-stack Store Rating web application built with **Express.js, PostgreSQL (Prisma ORM), React.js (Vite), and Tailwind CSS**. Users can submit ratings (from 1 to 5) for registered stores. The application features a unified single login system where functionalities are dynamically tailored based on the user's role: **System Administrator**, **Normal User**, or **Store Owner**.

---

## 🌟 Key Features & Role Matrix

| Requirement / Feature | System Administrator | Normal User | Store Owner |
|---|:---:|:---:|:---:|
| **Sign Up (Registration)** | — | ✅ | — |
| **Log In / Log Out** | ✅ | ✅ | ✅ |
| **Update Password** | ✅ | ✅ | ✅ |
| **View Dashboard Statistics** | ✅ (Users, Stores, Ratings) | — | ✅ (Store Avg & Raters) |
| **Add New Users & Stores** | ✅ | — | — |
| **View Stores Listing & Ratings** | ✅ | ✅ | ✅ |
| **Search & Filter Listings** | ✅ (Name, Email, Address, Role) | ✅ (Name, Address) | — |
| **Submit / Modify 1-5 Star Ratings** | — | ✅ | — |
| **Sort Tables (Ascending/Descending)** | ✅ | ✅ | ✅ |

---

## 🛠️ Tech Stack & Security Architecture

- **Backend**: ExpressJS (Node.js) with modular controllers, routes, and middleware architecture.
- **Database & ORM**: PostgreSQL with Prisma ORM (`User`, `Store`, `Rating` models).
- **Frontend**: ReactJS (Vite), React Router DOM (v7), Axios, Tailwind CSS, Lucide Icons.
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing (salt 10).
- **Validation**: `express-validator` on backend and reactive real-time validation on frontend.
- **Security Controls**:
  - `helmet` security headers.
  - CORS restricted to `CLIENT_URL`.
  - Rate limiting on authentication routes via `express-rate-limit`.
  - Database composite unique index `@@unique([userId, storeId])` ensuring one rating per store per user.

---

## 🔑 Seed Accounts Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| **System Administrator** | `admin@ratemystore.com` | `Password@123` | Full access to user/store creation & platform stats |
| **Store Owner** | `owner@ratemystore.com` | `Password@123` | Manages Supertech Electronics Store |
| **Normal User 1** | `johnathan.doe@example.com` | `Password@123` | Can submit/modify store ratings |
| **Normal User 2** | `jane.smith@example.com` | `Password@123` | Can submit/modify store ratings |
| **Normal User 3** | `alice.johnson@example.com` | `Password@123` | Can submit/modify store ratings |

---

## 📁 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ratemystore_db?schema=public"
JWT_SECRET="super_secret_jwt_key_ratemystore_2026"
JWT_EXPIRES_IN="1d"
CLIENT_URL="http://localhost:5173"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## 🚀 Quick Setup & Installation

### 1. Database Setup & Seeding
```bash
cd backend

# Install dependencies
npm install

# Push database schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed initial admin, owner, stores, users, and ratings
npm run prisma:seed
```

### 2. Start Backend Server
```bash
# In /backend directory
npm run dev
```
*Backend API will run on `http://localhost:5000` (Health check at `http://localhost:5000/health`).*

### 3. Start Frontend App
```bash
cd ../frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
*Frontend will run on `http://localhost:5173`.*

---

## 📋 Comprehensive API Endpoints List

### 🔓 Auth Routes (`/api/auth`)
- `POST /api/auth/signup` - Register a Normal User
- `POST /api/auth/login` - Unified login for Admin, User, Store Owner
- `PUT /api/auth/password` - Update logged-in user password *(Protected)*
- `GET /api/auth/me` - Fetch authenticated user profile *(Protected)*

### 🛡️ Admin Routes (`/api/admin`) - *(Requires ADMIN Role)*
- `GET /api/admin/dashboard` - Get total counts for users, stores, and ratings
- `GET /api/admin/users` - View all users with filters (Name, Email, Address, Role) & sorting
- `GET /api/admin/users/:id` - View user profile & Store Owner store rating
- `POST /api/admin/users` - Add new System Admin, Store Owner, or Normal User
- `GET /api/admin/stores` - View all stores with overall average rating & sorting
- `POST /api/admin/stores` - Add new store and assign to a Store Owner

### 🛍️ User & Rating Routes (`/api`) - *(Requires USER Role)*
- `GET /api/stores` - List all registered stores with overall rating and user's rating *(Logged-in)*
- `POST /api/ratings` - Submit a 1-5 star rating for a store (upserts existing rating)
- `PUT /api/ratings/:id` - Modify an existing submitted rating

### 🏪 Store Owner Routes (`/api/owner`) - *(Requires STORE_OWNER Role)*
- `GET /api/owner/dashboard` - View store average rating and list of users who submitted ratings

---

## ✅ Deliverables & PDF Requirements Checklist

- [x] **Project Naming**: Used `RateMyStore` in title, index.html, navbar, and package.json (`rate-my-store-backend`, `rate-my-store-frontend`).
- [x] **Roles Supported**: System Administrator, Normal User, Store Owner.
- [x] **Single Login System**: Role-based access control on backend via JWT middleware and frontend routes.
- [x] **Form Validations (Frontend & Backend)**:
  - Name: 20 to 60 characters enforced.
  - Address: Max 400 characters enforced.
  - Password: 8 to 16 characters with >= 1 uppercase letter and >= 1 special character enforced.
  - Email: Standard email validation enforced.
  - Rating: Integer between 1 and 5 enforced.
- [x] **System Administrator Features**:
  - Add stores, normal users, admin users, and store owners.
  - Dashboard with total users, stores, and submitted ratings.
  - List of stores with Name, Email, Address, and Overall Rating.
  - List of users with Name, Email, Address, and Role.
  - Filters by Name, Email, Address, and Role across listings.
  - User details modal displaying Store Owner average store rating.
- [x] **Normal User Features**:
  - Sign up & Log in.
  - Update password.
  - View registered stores with search by Name and Address.
  - Store card displaying Store Name, Address, Overall Rating, and User's Submitted Rating.
  - Interactive 1-to-5 star rating submit and modify controls.
- [x] **Store Owner Features**:
  - Log in & Update password.
  - Dashboard displaying store overall average rating and detailed list of customers who rated their store.
- [x] **Table Sorting**: All tables support ascending/descending column sorting for key fields (Name, Email, Address, Role, Rating, Date).
- [x] **Database Constraints**: Composite unique key `UNIQUE(user_id, store_id)` preventing duplicate ratings.
- [x] **Security**: Helmet headers, CORS restricted to CLIENT_URL, Auth rate limiting.
