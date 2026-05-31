import { createContext, useContext, useState, useEffect, useCallback } from "react";

const THEMES = ["default", "dark", "neutral", "minimalist"];
const STORAGE_KEY = "eval-theme";

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.includes(stored)) return stored;
  } catch {}
  return "default";
}

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = useCallback((t) => {
    if (!THEMES.includes(t)) return;
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
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
