import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/*  ==============================================
    PAGES
    ============================================== */
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Contact from "./pages/public/Contact";

/*  ===============================================
    DASHBOARD PAGE
    ===============================================*/
import StaffHome from "./pages/dashboard/staff/StaffHome";
import ModeratorHome from "./pages/dashboard/moderator/ModeratorHome";
import AdminHome from "./pages/dashboard/admin/AdminHome";
import Profile from "./pages/dashboard/Profile";

/*  ==============================================
    ERROR PAGES
    ==============================================*/
import NotFound from "./pages/error/NotFound";
import TooManyRequest from "./pages/error/TooManyRequest";
import Unauthorized from "./pages/error/Unauthorized";
import Maintenance from "./pages/error/Maintenance";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Auth Pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    {/* STAFF */}
                    <Route path="/staff" element={
                        <ProtectedRoute roles={["staff", "admin"]}>
                            <StaffHome />
                        </ProtectedRoute>
                    }/>

                    {/* MODERATOR */}
                    <Route path="/moderator" element={
                        <ProtectedRoute roles={["moderator", "admin"]}>
                            <ModeratorHome />
                        </ProtectedRoute>
                    }/>

                    {/* ADMIN */}
                    <Route path="/admin" element={
                        <ProtectedRoute roles={["admin"]}>
                            <AdminHome />
                        </ProtectedRoute>
                    }/>

                    {/* PROFILE (all authenticated roles) */}
                    <Route path="/profile" element={
                        <ProtectedRoute roles={["user", "staff", "moderator", "admin"]}>
                            <Profile />
                        </ProtectedRoute>
                    }/>

                    {/* Error Pages */}
                    <Route path="/401" element={<Unauthorized />} />
                    <Route path="/429" element={<TooManyRequest />} />
                    <Route path="/maintenance" element={<Maintenance />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;