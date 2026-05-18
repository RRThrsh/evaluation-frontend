# Evaluation Frontend

Frontend for the Student Evaluation Workflow System — a role-based platform where staff submit evaluation requests with auto-evaluation, moderators review with full subject management, and administrators approve users and oversee the process.

Built with **React 19**, **Vite**, **Tailwind CSS 4**, **Framer Motion**, and **React Router 7**.

## Roles & Routing

| Route | Role | Description |
|---|---|---|
| `/` | Public | Landing page + student lookup search |
| `/login`, `/register`, `/forgot-password` | Public | Authentication (register creates pending account) |
| `/staff` | staff, admin | Submit evaluations, view results, send PDF |
| `/moderator` | moderator, admin | Review evaluations, edit student subjects, override |
| `/admin` | admin | Approve/reject users, browse/edit tables |
| `/profile` | Any authenticated | Profile management |
| `/401` | Public | Unauthorized page |
| `/429` | Public | Rate limit page |
| `/maintenance` | Public | Maintenance page |

## Features

- **Admin approval flow**: New accounts are `pending` on register; admin must approve before login
- **Public student search**: Anyone can look up a student by number and see enrolled subjects
- **Auto-evaluation**: Staff submits a student number → backend grades all subjects, checks prerequisites, detects retakes, and plans next semester
- **Semester advancement**: Each evaluation advances the student 1 semester (unless retaking failed subjects)
- **Moderator subject editor**: Moderators can add/remove/update subjects for any student directly in the evaluation modal
- **PDF generation**: Staff can send evaluation results as PDF to the student's email
- **Input sanitization**: All user inputs are sanitized (strips `<>"'&`) before sending to backend

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── button/          # Reusable Button component
│   │   └── inputfield/      # Reusable InputField component
│   ├── layout/              # Header, Footer
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx      # Auth state (login, register, logout, profile)
├── pages/
│   ├── public/              # Home (with student search), About, Contact
│   ├── auth/                # Login, Register, ForgotPassword
│   ├── dashboard/
│   │   ├── user/            # UserHome (removed — redirects to /)
│   │   ├── staff/           # StaffHome (submit, view evaluations, send PDF)
│   │   ├── moderator/       # ModeratorHome (review, edit subjects, override)
│   │   ├── admin/           # AdminHome (pending users, table browser)
│   │   └── Profile.jsx
│   └── error/               # 401, 429, Maintenance, NotFound
├── services/
│   └── api.js               # HTTP client (fetch wrapper with methods: get, post, put, patch, delete)
├── utils/
│   └── sanitize.js          # sanitizeInput, sanitizeObject
├── styles/
│   └── index.css            # Tailwind CSS entry point
├── test/
│   └── setup.js             # Vitest setup
├── __tests__/               # Test files
└── App.jsx                  # Root component with route definitions
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | (empty) | Backend API base URL (empty = same origin / proxy) |

## Getting Started

```bash
npm install
npm run dev        # Vite dev server (default: http://localhost:5173)
# or
npm run preview    # Preview production build
```

The Vite dev server proxies `/api` requests to the backend at `http://localhost:3000` (configured in `vite.config.js`).

## Testing

Tests use **Vitest** + **React Testing Library**.

```bash
npm test           # Run tests once
npm run test:watch # Watch mode
```

### Test files

| File | What it covers |
|---|---|
| `src/__tests__/api.test.js` | HTTP methods, auth headers, error/429 handling |
| `src/__tests__/AuthContext.test.jsx` | Login, register, logout, forgot password, profile update |
| `src/__tests__/ProtectedRoute.test.jsx` | Loading spinner, auth guard, role-based access |
| `src/__tests__/Button.test.jsx` | Rendering, click, disabled/loading states, icons |
| `src/__tests__/InputField.test.jsx` | Label, placeholder, value, password toggle |

## Docker

The frontend is served via nginx in production. Build and run with the backend's `docker-compose.yml`:

```bash
# From evaluation-backend/
docker compose up -d

# Frontend: http://localhost:80
# Backend:  http://localhost:3002
```

Nginx proxies `/api` requests to the backend container (`backend:3000`).
