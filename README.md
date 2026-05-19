# Evaluation Frontend

Frontend for the Student Evaluation Workflow System — a role-based platform where staff submit evaluation requests, moderators review with full subject management, and administrators oversee users, enrollments, and system config.

Built with **React 19**, **Vite**, **Tailwind CSS 4**, **Framer Motion**, and **React Router 7**.

## Roles & Routing

| Route | Role | Description |
|---|---|---|
| `/` | Public | Landing page + student lookup search |
| `/login`, `/register`, `/forgot-password` | Public | Authentication (register creates pending account) |
| `/staff` | staff, admin | Submit evaluations, view submissions |
| `/moderator` | moderator, admin | Review evaluations, edit student subjects |
| `/admin` | admin | Full admin dashboard |
| `/profile` | Any authenticated | Profile management |
| `/401`, `/429`, `/maintenance` | Public | Error pages |

## Features

- **Admin approval flow**: New accounts = `pending`; admin approves before login
- **Public student search**: Look up any student by number + enrolled subjects
- **Staff submits PENDING request** — no auto-evaluation; moderator reviews
- **Staff submission tracking**: Submissions split into **Pending** (yellow, unseen), **Response Received** (green with blue dot on unread items), and **Seen** (gray) — all with pagination
- **Moderator evaluation**: Grade checking, carry-over/retake/prerequisite detection; always sets FOR_ENROLLMENT
- **Moderator request list**: Shows assigned course name/code for each student
- **Irregular handling**: >2 failed subjects → moderator marks irregular → admin decides enrollment
- **Admin enrollment**: Clickable row opens modal with Confirm/Reject buttons
- **Moderator-course assignment**: Moderators only see students in their assigned courses
- **Auto-generated student numbers**: `{PREFIX}-{SEQUENCE:04d}` format, configurable prefix
- **Real-time notifications**: Bell badge + dropdown with sound; auto-polls every 15s; plays audio chime on new notifications
- **Click sounds**: Subtle audio feedback on all button clicks
- **Excel export**: Client-side SheetJS export for Evaluated and Pre Enroll sections
- **Dashboard overview**: Stats cards, donut chart (status distribution), bar charts (students per course, monthly trends), recent activity feed, quick actions
- **Academic Config**: Admin-managed grading rules, thresholds, labels, and student number prefix
- **Database browser**: Admin can view/edit any table with dynamic PK detection
- **Pagination**: 15/page admin tables, 10/page moderator/staff lists
- **Modal behavior**: All modals close on backdrop click and Escape key
- **SVG icons**: All Edit/Delete text buttons replaced with pencil/trash icons
- **In-memory cache**: GET responses cached 60s; cleared on mutations (prefix: 4 URL segments)

## Project Structure

```
src/
├── components/
│   ├── admin/           # AdminHome, Sidebar, StatsCards, DashboardOverview,
│   │                    # PendingEnrollments, CompletedEnrollments, UserManager,
│   │                    # StudentManager, CourseManager, SubjectManager,
│   │                    # AcademicConfigManager, ModeratorCourses, DatabaseViewer,
│   │                    # AuditLogViewer, RoleManager, EnrollmentHistory
│   ├── moderator/       # ModeratorHome, ModeratorHeader, RequestList,
│   │                    # SubjectEditor, DetailModal, EvaluationReport
│   ├── staff/           # StaffHome, StaffHeader, SubmitForm, SubmissionsList,
│   │                    # DetailModal, EvaluationReport
│   ├── common/          # NotificationBell, ClickSoundProvider, SvgIcon,
│   │                    # ConfirmModal, Pagination
│   ├── layout/          # Header, Footer
│   ├── profile/         # ProfileHeader, ProfileHero, ProfileInfo, ProfileFAQ,
│   │                    # ProfileSidebar
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── public/          # Home (with student search), About, Contact
│   ├── auth/            # Login, Register, ForgotPassword
│   ├── dashboard/       # StaffHome, ModeratorHome, AdminHome, Profile
│   └── error/           # 401, 429, Maintenance, NotFound
├── services/
│   └── api.js           # HTTP client with caching + error handling
├── utils/
│   └── exportToExcel.js # SheetJS export with nested object flattening
├── styles/
│   └── index.css        # Tailwind CSS entry point
└── App.jsx              # Root with routes + ClickSoundProvider
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | (empty) | Backend API base URL (empty = same origin) |

## Getting Started

```bash
npm install
npm run dev        # Vite dev server (default: http://localhost:5173)
```

The Vite dev server proxies `/api` to `http://localhost:3000` (configured in `vite.config.js`).

## Docker

Frontend is served via nginx in production. Build with backend's `docker-compose.yml`:

```bash
cd evaluation-backend
docker compose up -d

# Frontend: http://localhost:80
# Backend:  http://localhost:3002
```

Nginx proxies `/api` to the backend container (`backend:3000`).

## Testing

Tests use **Vitest** + **React Testing Library**.

```bash
npm test           # Run once
npm run test:watch # Watch mode
npm run lint       # ESLint
```

## CI/CD

GitHub Actions workflow runs on push/PR to `main`:
- `npm ci` (deterministic install with caching)
- `npm run lint`
- `npm run build`
- `npm test`
