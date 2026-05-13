import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({
    children,
}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] =
        useState(true);

    const loadUser = () => {

        const token =
            localStorage.getItem(
                "accessToken"
            );

        const storedUser =
            localStorage.getItem("user");

        if (!token || !storedUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {

            const decoded =
                jwtDecode(token);

            if (
                !decoded.exp ||
                decoded.exp * 1000 <
                    Date.now()
            ) {
                logout();
                return;
            }

            setUser(
                JSON.parse(storedUser)
            );

        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem("user");

        setUser(null);
    };

    const login = (token, userData) => {
        localStorage.setItem(
            "accessToken",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);
    };

    useEffect(() => {
        loadUser();

        const handler = () => loadUser();

        window.addEventListener(
            "token-refresh",
            handler
        );

        return () =>
            window.removeEventListener(
                "token-refresh",
                handler
            );
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
                isAdmin:
                    user?.role === "admin",
                isModerator:
                    user?.role === "moderator",
                isStaff:
                    user?.role === "staff",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);