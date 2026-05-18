import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/auth/me")
      .then((data) => setUser(data.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.data.token);
    setUser(data.data.user);
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const data = await api.post("/api/auth/register", formData);
    return data;
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return api.post("/api/auth/forgot-password", { email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const res = await api.put("/api/auth/me", data);
    setUser(res.data);
    return res;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, forgotPassword, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export default AuthContext;
