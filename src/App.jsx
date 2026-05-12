import { Routes, Route } from 'react-router-dom';

{/* PAGES */}
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from "./pages/NotFound";
import TooManyRequests from "./pages/TooManyRequests";

export default function App() {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* USERS */}

            {/* MODERATORS */}

            {/* ADMIN */}
            
            {/* ERROR HANDLER */}
            <Route path="/429" element={<TooManyRequests />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}