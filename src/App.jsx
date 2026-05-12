import { Routes, Route } from "react-router-dom";

// PAGES
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TooManyRequests from "./pages/TooManyRequests";

// ROUTES
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
    return (
        <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />

            {/* USER */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute
                        allowedRoles={["user", "moderator", "admin"]}
                    >
                        <div>Dashboard</div>
                    </ProtectedRoute>
                }
            />

            {/* MODERATOR */}
            <Route
                path="/moderate"
                element={
                    <ProtectedRoute
                        allowedRoles={["moderator", "admin"]}
                    >
                        <div>Moderation Panel</div>
                    </ProtectedRoute>
                }
            />

            {/* ADMIN */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <div>Admin Panel</div>
                    </ProtectedRoute>
                }
            />

            {/* ERRORS */}
            <Route path="/429" element={<TooManyRequests />} />
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}