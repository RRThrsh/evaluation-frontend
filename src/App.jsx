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