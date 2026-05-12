import { Routes, Route } from 'react-router-dom';

{/* PAGES */}
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ERROR HANDLER */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}