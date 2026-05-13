import { Routes, Route } from "react-router-dom";

// PUBLIC PAGES
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import TooManyRequests from "./pages/TooManyRequests";

// ROLE PAGES
import Home from "./pages/Home";
import StaffHome from "./pages/staff/StaffHome";
import ModeratorHome from "./pages/moderator/ModeratorHome";
import AdminHome from "./pages/admin/AdminHome";

// LAYOUT
import AdminLayout from "./components/layout/AdminLayout";

// ROUTES
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
    return (
        <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* USER */}
            <Route path="/home" element={
                    <ProtectedRoute
                        allowedRoles={["user"]}
                    >
                        <Home />
                    </ProtectedRoute>
                }
            />

            {/* STAFF */}
            <Route path="/staff" element={
                    <ProtectedRoute
                        allowedRoles={[
                            "staff",
                        ]}
                    >
                        <StaffHome />
                    </ProtectedRoute>
                }
            />

            {/* MODERATOR */}
            <Route path="/moderator" element={
                    <ProtectedRoute
                        allowedRoles={[
                            "moderator",
                        ]}
                    >
                        <ModeratorHome />
                    </ProtectedRoute>
                }
            />

            {/* ADMIN */}
            <Route path="/admin" 
                element={
                    <ProtectedRoute allowedRoles={[ "admin" ]} >
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminHome />} />
            </Route>

            {/* ERRORS */}
            <Route path="/429" element={<TooManyRequests />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}