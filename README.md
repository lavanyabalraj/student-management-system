# Student Management System (Full-Stack)

React (Vite) + Node.js/Express + MySQL + JWT Auth

---

## 1. Folder Structure

```
student-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js     # register/login logic
│   │   └── studentController.js  # student CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── userModel.js          # users table queries
│   │   └── studentModel.js       # students table queries
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   ├── sql/
│   │   └── schema.sql            # DB + table creation script
│   ├── .env.example              # rename to .env and fill in
│   ├── package.json
│   └── server.js                 # app entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # axios instance + JWT interceptor
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StudentForm.jsx
    │   │   ├── StudentDetails.jsx
    │   │   └── ConfirmModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Students.jsx
    │   ├── App.jsx                # routes
    │   ├── main.jsx                # entry point
    │   └── index.css               # all styling
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 2. Installation Commands

You need **Node.js (v18+)** and **MySQL** installed locally.

### Backend
```bash
cd backend
npm install
cp .env.example .env      # then edit .env with your real MySQL credentials + JWT secret
npm run dev                # starts on http://localhost:5000 (uses nodemon)
# or: npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

---

## 3. MySQL Database Creation

Open MySQL CLI or MySQL Workbench and run:

```sql
CREATE DATABASE IF NOT EXISTS student_management;
```

Or simply run the full script in `backend/sql/schema.sql`, which creates the database
**and** both tables in one go:

```bash
mysql -u root -p < backend/sql/schema.sql
```

---

## 4. SQL Table Creation Scripts

See `backend/sql/schema.sql` (already includes both tables):

- `users` — id, name, email (UNIQUE), password (hashed), created_at
- `students` — id, name, department, age, gender, email, phone, address, created_at

---

## 5. Backend Implementation

Clean MVC structure:
- **config/db.js** — MySQL connection pool (mysql2/promise) with a startup connectivity check.
- **models/** — raw SQL queries only, no business logic.
- **controllers/** — validation + business logic, calls models, sends responses.
- **routes/** — maps HTTP verbs/paths to controller functions.
- **middleware/authMiddleware.js** — verifies JWT from the `Authorization: Bearer <token>` header, protects student routes.
- **server.js** — wires everything together, global error handling, 404 handler.

Passwords are hashed with **bcrypt** (10 salt rounds) before being stored — plaintext passwords are never saved. JWTs are signed with `JWT_SECRET` from `.env` and expire per `JWT_EXPIRES_IN` (default `1d`).

---

## 6. Frontend Implementation

- **AuthContext** stores the logged-in user (and keeps the JWT in `localStorage`) so login state survives refreshes.
- **ProtectedRoute** wrapper in `App.jsx` redirects to `/login` if no token is present.
- **axios.js** automatically attaches the JWT to every request, and auto-logs-out on a 401 response.
- Plain CSS (`index.css`) — no Bootstrap — fully responsive with CSS Grid/Flexbox and media queries.

---

## 7. API Integration

Frontend talks to backend via the shared `api` axios instance (`baseURL: http://localhost:5000/api`).

| Frontend action              | Backend endpoint            |
|-------------------------------|------------------------------|
| Register form submit          | `POST /api/register`        |
| Login form submit             | `POST /api/login`           |
| Load students table           | `GET /api/students?search=` |
| View student details          | `GET /api/students/:id`     |
| Add student form submit       | `POST /api/students`        |
| Edit student form submit      | `PUT /api/students/:id`     |
| Delete button + confirm       | `DELETE /api/students/:id`  |

---

## 8. JWT Authentication Flow

1. User registers or logs in → backend hashes/compares password with bcrypt → issues a JWT containing `{ id, name, email }`.
2. Frontend stores the JWT in `localStorage` via `AuthContext.login()`.
3. Every subsequent API call automatically includes `Authorization: Bearer <token>` (axios interceptor).
4. Backend's `authMiddleware.protect` verifies the token on every `/api/students/*` route; invalid/expired tokens get `401 Unauthorized`.
5. Frontend's axios response interceptor catches `401`s, clears storage, and redirects to `/login`.

---

## 9. CRUD Functionality

All student CRUD operations are protected and fully wired end-to-end:

- **Create** — "Add Student" button opens `StudentForm` modal → validated client-side → `POST /api/students`.
- **Read** — Table loads via `GET /api/students`, search box filters via `?search=name` (debounced).
- **Update** — "Edit" button opens the same `StudentForm` pre-filled → `PUT /api/students/:id`.
- **Delete** — "Delete" button opens `ConfirmModal` → on confirm, `DELETE /api/students/:id`.
- **View** — "View" button opens a read-only `StudentDetails` modal.

Server-side validation is duplicated in the backend controllers (never trust client-only validation):
- Required fields, valid email format, phone = exactly 10 digits, age between 18–60.

---

## 10. Testing Instructions

### A. Start everything
1. Start MySQL, run `schema.sql`.
2. `cd backend && npm run dev` → confirm console shows `✅ MySQL connected successfully` and `🚀 Server running on http://localhost:5000`.
3. `cd frontend && npm run dev` → open `http://localhost:5173`.

### B. Manual test flow
1. Go to `/register`, create an account (try mismatched passwords / short password first to see validation).
2. You're auto-logged-in and redirected to `/dashboard` — confirm your name appears in the welcome message.
3. Click **Students** in the navbar.
4. Click **+ Add Student**, fill the form (try invalid phone/age first to confirm validation), submit.
5. Confirm the new student appears in the table.
6. Use the search bar to filter by name.
7. Click **View** to see full details, **Edit** to update a record, **Delete** to remove it (confirm the popup appears).
8. Click **Logout**, confirm you're redirected to `/login` and `/students` is no longer accessible directly (redirects back to login).
9. Log back in with the same credentials to confirm login works against the hashed password.

### C. API testing (optional, via Postman/curl)
```bash
# Register
curl -X POST http://localhost:5000/api/register -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get students (replace TOKEN with the JWT from login response)
curl http://localhost:5000/api/students -H "Authorization: Bearer TOKEN"
```

---

## Notes for your placement round

- Be ready to explain: bcrypt hashing (`bcrypt.hash` / `bcrypt.compare`), JWT signing/verification (`jsonwebtoken`), the axios interceptor pattern, and the MVC separation (models = SQL only, controllers = logic, routes = wiring).
- Both frontend and backend validate inputs — frontend for UX, backend because it's the actual source of truth/security.
- `.env` is git-ignored in real projects; only `.env.example` should be committed.
