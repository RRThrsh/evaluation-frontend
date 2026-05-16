# Evaluation Frontend

Frontend for the Student Evaluation Workflow System — a role-based platform where staff submit evaluation requests, moderators review and approve, and administrators oversee the process.

Built with **React 19**, **Vite**, **Tailwind CSS 4**, **Framer Motion**, and **React Router 7**.

## Roles & Routing

| Route | Role | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login`, `/register`, `/forgot-password` | Public | Authentication |
| `/users` | user, admin | Student dashboard |
| `/staff` | staff, admin | Staff dashboard |
| `/moderator` | moderator, admin | Moderator dashboard |
| `/admin` | admin | Admin dashboard |
| `/profile` | Any authenticated | Profile management |
| `/401` | Public | Unauthorized page |
| `/429` | Public | Rate limit page |
| `/maintenance` | Public | Maintenance page |

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── button/       # Reusable Button component
│   │   └── inputfield/   # Reusable InputField component
│   ├── layout/           # Header, Footer, Sidebar
│   ├── admin/            # Admin-specific components
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx   # Auth state (login, register, logout, etc.)
├── pages/
│   ├── public/           # Home, About, Contact
│   ├── auth/             # Login, Register, ForgotPassword
│   ├── dashboard/        # User, Staff, Moderator, Admin, Profile
│   └── error/            # 401, 429, Maintenance, NotFound
├── services/
│   └── api.js            # HTTP client (fetch wrapper)
├── styles/
│   └── index.css         # Tailwind CSS entry point
├── test/
│   └── setup.js          # Vitest setup (jest-dom matchers, localStorage mock)
├── __tests__/            # Test files
└── App.jsx               # Root component with route definitions
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | Backend API base URL |
| `DB_PASSWORD` | *(docker-compose only)* | PostgreSQL password for Docker |

## Getting Started

```bash
npm install
npm run dev        # Vite dev server (default: http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
```

The Vite dev server proxies `/api` requests to the backend at `http://localhost:3000`.

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

```bash
docker compose up --build
```

The compose file also starts the backend (from `../evaluation-backend`) and a PostgreSQL 16 instance. See `docker-compose.yml` for service configuration:

- **Frontend**: `localhost:80` (served via nginx, proxies `/api` to backend)
- **Backend**: `localhost:3001` (maps to container port 3000)
- **PostgreSQL**: `localhost:5433` (maps to container port 5432)
