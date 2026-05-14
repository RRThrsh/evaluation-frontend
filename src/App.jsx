import { BrowserRouter, Routes, Route } from "react-router-dom";

/*  ==============================================
    COMPONENTS
    ============================================== */

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
import UsersHome from "./pages/dashboard/user/UsersHome";
import StaffHome from "./pages/dashboard/staff/StaffHome";
import ModeratorHome from "./pages/dashboard/moderator/ModeratorHome";
import AdminHome from "./pages/dashboard/admin/AdminHome";

/*  ==============================================
    ERROR PAGES
    ==============================================*/
import NotFound from "./pages/error/NotFound";
import TooManyRequest from "./pages/error/TooManyRequest";
import Unauthorized from "./pages/error/Unauthorized";
import Maintenance from "./pages/error/Maintenance";

function App() {
    return (
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
                {/* USERS */}
                <Route>
                    <Route path="/users" element={<UsersHome />}/>
                </Route>

                {/* STAFF */}
                <Route>
                    <Route path="/staff" element={<StaffHome />}/>
                </Route>

                {/* MODERATOR */}
                <Route>
                    <Route path="/moderator" element={<ModeratorHome />}/>
                </Route>

                {/* ADMIN */}
                <Route>
                    <Route path="/admin" element={<AdminHome />}/>
                </Route>

                {/* Error Pages */}
                <Route path="/401" element={<Unauthorized />} />
                <Route path="/429" element={<TooManyRequest />} />
                <Route path="/maintenance" element={<Maintenance />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;