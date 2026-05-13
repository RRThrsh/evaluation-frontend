import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles,
}) {

    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const role = user.role?.toLowerCase();

    if (
        allowedRoles &&
        !allowedRoles.includes(role)
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return children;
}