import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const THEMES = ["default", "dark", "neutral", "minimalist"];
const STORAGE_KEY = "eval-theme";

function getLocalTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.includes(stored)) return stored;
  } catch {}
  return null;
}

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState(() => getLocalTheme() || "default");
  const synced = useRef(false);

  // Sync theme from server when user loads
  useEffect(() => {
    if (!user?.theme) return;
    if (synced.current && user.theme === theme) return;
    if (user.theme !== theme) {
      setThemeState(user.theme);
      try { localStorage.setItem(STORAGE_KEY, user.theme); } catch {}
    }
    synced.current = true;
  }, [user?.theme]);

  const setTheme = useCallback((t) => {
    if (!THEMES.includes(t)) return;
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
    api.patch("/api/auth/theme", { theme: t }).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
