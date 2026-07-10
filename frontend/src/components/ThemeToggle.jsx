import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const KEY = "cipd-theme";

function getInitial() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      onClick={toggle}
      data-testid="theme-toggle"
      aria-label="Toggle color theme"
      className="relative inline-flex items-center w-[58px] h-[30px] rounded-full border border-black/10 dark:border-white/15 transition-colors overflow-hidden"
      style={{ background: "var(--bg-mute)" }}
    >
      <span
        className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full shadow-sm transition-transform duration-500 flex items-center justify-center"
        style={{
          transform: theme === "dark" ? "translateX(28px)" : "translateX(0)",
          background: theme === "dark" ? "#1a1a1c" : "#ffffff",
        }}
      >
        {theme === "dark" ? (
          <Moon className="w-3 h-3 text-white" />
        ) : (
          <Sun className="w-3 h-3" style={{ color: "#0a0a0b" }} />
        )}
      </span>
      <Sun className="absolute left-[7px] top-1/2 -translate-y-1/2 w-3 h-3 opacity-50" style={{ color: "var(--ink-3)" }} />
      <Moon className="absolute right-[7px] top-1/2 -translate-y-1/2 w-3 h-3 opacity-50" style={{ color: "var(--ink-3)" }} />
    </button>
  );
}
