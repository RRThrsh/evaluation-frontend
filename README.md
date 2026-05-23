# Evaluation Frontend

Frontend for the Academic Evaluation System — a role-based platform where evaluators submit clearance evaluations, and administrators manage students, courses, subjects, enrollments, and system configuration.

Built with **React 19**, **Vite**, **Tailwind CSS 4**, **Framer Motion**, and **React Router 7**.

## Roles & Routing

| Route | Role | Description |
|---|---|---|
| `/login`, `/register`, `/forgot-password`, `/reset-password/:token` | Public | Authentication (register creates pending account) |
| `/evaluator` | evaluator, admin | Evaluation Hub — search students, review grades, submit evaluations |
| `/admin` | admin, superadmin | Full admin dashboard with all management panels |
| `/profile` | Any authenticated | Profile management |
| `/401`, `/429`, `/maintenance` | Public | Error pages |

## Features

- **Admin approval flow**: New accounts = `pending`; admin approves before login
- **Evaluator search**: Look up any student by student number, review subjects, grades, and prerequisites
- **Evaluation engine**: Auto-detects pass/fail/INC per subject; checks prerequisite chains; identifies retakes and gap-filler minor subjects; produces qualified/conditional/disqualified status
- **Evaluator workflow**: Submit PENDING evaluation → admin reviews and promotes to PRE_ENROLLED → admin finalizes enrollment
- **Evaluator-course assignment**: Evaluators only see students in their assigned courses
- **Irregular handling**: >1 failed subject → student flagged as irregular
- **Admin dashboard**: Stats cards, bar chart (students per program), pie chart (status distribution), monthly trends, recent activity feed, quick actions
- **System controls**: Toggle evaluator access, maintenance mode, send broadcasts, emergency shutdown
- **Course/Subject/Student CRUD**: Full management panels with search, sort, pagination
- **Auto-generated student numbers**: `{PREFIX}-{SEQUENCE:04d}` format, configurable prefix
- **Class Subjects**: Section assignment per student enrollment; student search/add bar
- **Pre-Evaluate panel**: Review and evaluate students for next semester enrollment
- **Pre-Enrolled panel**: Admin reviews PENDING evaluations and promotes to PRE_ENROLLED, stores immutable snapshots
- **Snapshots**: Point-in-time captures of evaluation state at evaluator_submit and admin_pre_enroll
- **Enrolled Students**: View all enrolled students, export to Excel, import from Excel
- **Evaluator Logs**: Comprehensive view of all subject_requests with filtering
- **Grading panel**: Per-period grade management (prelim, midterm, finals) with section filtering
- **Permission management**: Granular per-user permission overrides with a management UI
- **Academic Config**: Admin-managed passing grade, irregular threshold, year levels, semesters per year, student number prefix
- **Database browser**: Admin can view/edit/delete any database table
- **Audit trail**: All actions logged with user, timestamp, old/new data
- **Real-time notifications**: Bell badge + dropdown; auto-polls every 15s; audio chime on new notifications
- **Excel export**: Client-side SheetJS export for enrolled students and other data
- **In-memory cache**: GET responses cached 60s; cleared on mutations (prefix: 4 URL segments)
- **Pagination**: 15/page admin tables, 10/page evaluator lists
- **Modal behavior**: All modals close on backdrop click and Escape key

## Project Structure

```
src/
├── components/
│   ├── admin/           # AdminHome, Sidebar, StatsCards, DashboardOverview,
│   │                    # CourseManager, SubjectManager, StudentManager,
│   │                    # AcademicConfigManager, ClassSubject, Grading,
│   │                    # PreEvaluate, PreEnrolled, EnrolledStudents,
│   │                    # PermissionManager, DatabaseViewer, AuditLogViewer,
│   │                    # EvaluatorLogs, SessionManager, Snapshots,
│   │                    # EvaluatorEvaluations, EvaluatorCourses,
│   │                    # AcademicRecord, ImportLogs, PendingUsers,
│   │                    # RoleManager, StudentSubjectsModal, StudentGradeWizard,
│   │                    # AdminHeader, DeleteModal, SkeletonRows, StudentForm,
│   │                    # StudentList
│   ├── evaluator/       # EvaluatorHome, EvaluatorHeader, RequestList,
│   │                    # SubjectEditor, DetailModal, EvaluationReport
│   ├── common/          # NotificationBell, ClickSoundProvider, ErrorBoundary,
│   │                    # ConfirmModal, Pagination, SvgIcon,
│   │                    # Button, InputField (with subdirs)
│   ├── layout/          # Header, Sidebar, Footer
│   ├── profile/         # ProfileHeader, ProfileHero, ProfileInfo, ProfileFAQ,
│   │                    # ProfileSidebar, ProfileActivity, ChangePasswordModal
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── PermissionContext.jsx
├── pages/
│   ├── auth/            # Login, Register, ForgotPassword, ResetPassword
│   ├── dashboard/       # EvaluatorHome, AdminHome, Profile
│   └── error/           # 401, 429, Maintenance, NotFound
├── services/
│   └── api.js           # HTTP client with caching + error handling
├── utils/
│   ├── exportToExcel.js # SheetJS export with nested object flattening
│   └── sanitize.js      # Input sanitization
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
docker compose up -d --build

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
