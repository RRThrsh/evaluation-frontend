import { Routes, Route } from 'react-router-dom';

{/* PAGES */}
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from "./pages/NotFound";
import TooManyRequests from "./pages/TooManyRequests";
import Home from './pages/Home';

{/* ROUTES */}
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />

            {/* USERS */}
            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={["user", "moderator", "admin"]}>
                    <div>Dashboard</div>
                </ProtectedRoute>
            } />

            {/* MODERATORS */}
            <Route path="/moderate" element={
                <ProtectedRoute allowedRoles={["moderator", "admin"]}>
                    <div>Moderation Panel</div>
                </ProtectedRoute>
            } />

            {/* ADMIN */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <div>Admin Panel</div>
                </ProtectedRoute>
            } />

            {/* ERROR HANDLER */}
            <Route path="/429" element={<TooManyRequests />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}