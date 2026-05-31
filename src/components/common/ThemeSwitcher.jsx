import { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const THEME_META = {
  default:    { label: "Default",    dot: "bg-indigo-500" },
  dark:       { label: "Dark Mode",  dot: "bg-slate-900" },
  neutral:    { label: "Neutral",    dot: "bg-slate-400" },
  minimalist: { label: "Minimalist", dot: "bg-gray-300" },
};

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface text-text-secondary hover:bg-surface-muted hover:text-text transition"
        title="Change theme"
      >
        <Palette size={16} />
      </button>

      {open && (
        <div className="theme-dropdown py-1">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => { setTheme(t); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition hover:bg-surface-muted ${
                theme === t ? "font-semibold text-text" : "text-text-secondary"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${THEME_META[t].dot} ring-1 ring-slate-300/50 shrink-0`} />
              <span>{THEME_META[t].label}</span>
              {theme === t && (
                <span className="ml-auto text-primary-500 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
