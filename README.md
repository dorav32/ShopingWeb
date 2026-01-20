# ShopingWeb — Full-Stack E-Commerce (React + Node/Express + MongoDB)

A full-stack e-commerce application featuring a React + Redux frontend and a Node.js/Express REST API backed by MongoDB (Mongoose).

## Tech Stack
**Frontend:** React, Redux (store + slices), REST API client layer  
**Backend:** Node.js, Express, MongoDB, Mongoose, CORS, Cookie-based auth middleware  
**Database:** MongoDB

## Key Features
- Authentication & user flows (login/register)
- Product catalog + product details
- Cart management (add/remove/update quantities)
- Favorites (wishlist)
- Orders flow
- Admin UI (manage products/users)

## Architecture Overview
Project Structure
backend/
  routes/        # auth, users, products, carts, orders, favorites
  models/        # User, Product, Cart, Order, Favorite
  utils/         # token verification, validation, utilities
frontend/
  src/
    views/       # screens (Home, Dashboard, Admin, Auth, User)
    redux/       # store, api clients, slices
    components/  # shared UI components

### API Routes (high level)
- `/api/auth`
- `/api/users`
- `/api/products`
- `/api/carts`
- `/api/orders`
- `/api/favorites`

## Getting Started (Local)
### Prerequisites
- Node.js (LTS recommended)
- MongoDB (local or Docker)

### 1) Clone
```bash
git clone https://github.com/dorav32/ShopingWeb.git
cd ShopingWeb

### Backend:
cd backend
cp .env.example .env
npm install
npm run start

### Frontend:
cd ../frontend
cp .env.example .env
npm install
npm start
