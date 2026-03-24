# Jigi Jewels — Full Stack App

A full-stack luxury jewelry marketplace for Jigi Jewels, Enugu Nigeria.

## Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

---

## Setup Instructions

### 1. Install PostgreSQL
Make sure PostgreSQL is installed and running on your machine.

Create a database:
```sql
CREATE DATABASE jigi_jewels;
```

Run the schema:
```bash
psql -U your_username -d jigi_jewels -f backend/db.sql
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Copy the env file and fill in your values:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/jigi_jewels
JWT_SECRET=any_random_secret_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=jigijewels2025
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

The API will run at: http://localhost:5000

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The site will run at: http://localhost:5173

---

## Pages

| Page | URL |
|------|-----|
| Home | / |
| Shop | /shop |
| Item Detail | /shop/:id |
| About | /about |
| Admin Login | /admin/login |
| Admin Dashboard | /admin |

---

## Admin Panel

1. Go to `/admin/login`
2. Login with the credentials in your `.env`
3. You can:
   - **Products tab** — Add, edit, delete products. Upload multiple photos per product. Set a main/primary photo.
   - **Orders tab** — See all WhatsApp orders logged from the site. Update status (new → contacted → completed). Delete orders.
   - **Visitors tab** — See total visits, today's visits, weekly visits, top pages, and recent visitor log.

---

## Changing Admin Password
Edit the `ADMIN_PASSWORD` value in `backend/.env` and restart the backend.

---

## Production Deployment

**Backend:** Deploy to Railway, Render, or any Node.js host. Set environment variables there.

**Frontend:** Run `npm run build` in the frontend folder. Deploy the `dist/` folder to Vercel or Netlify.

Make sure to set `FRONTEND_URL` in your backend env to your real frontend domain.

---

## WhatsApp Number
The WhatsApp number is `2348072154424`. To change it, search for `2348072154424` across the frontend files and replace with your number.

---

## Uploads
Product photos are stored in `backend/uploads/`. Make sure this folder exists and is writable.
