import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ClickSoundProvider from "./components/common/ClickSoundProvider";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ChatBox from "./components/common/ChatBox";

/*  ==============================================
    PAGES
    ============================================== */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/*  ===============================================
    DASHBOARD PAGE
    ===============================================*/
import EvaluatorHome from "./pages/dashboard/evaluator/EvaluatorHome";
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
        <ThemeProvider>
        <ClickSoundProvider>
        <ErrorBoundary>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Redirect root to login */}
                    <Route path="/" element={<Login />} />

                    {/* Auth Pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                    />

                    {/* EVALUATOR */}
                    <Route path="/evaluator" element={
                        <ProtectedRoute roles={["evaluator", "admin"]}>
                            <EvaluatorHome />
                        </ProtectedRoute>
                    }/>

                    {/* ADMIN */}
                    <Route path="/admin" element={
                        <ProtectedRoute roles={["admin", "superadmin"]}>
                            <AdminHome />
                        </ProtectedRoute>
                    }/>

                    {/* PROFILE (all authenticated roles) */}
                    <Route path="/profile" element={
                        <ProtectedRoute roles={["evaluator", "admin", "superadmin"]}>
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
                <ChatBox />
            </BrowserRouter>
        </AuthProvider>
        </ErrorBoundary>
        </ClickSoundProvider>
        </ThemeProvider>
    );
}

export default App;
