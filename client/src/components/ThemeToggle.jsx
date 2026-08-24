import { useEffect, useState } from "react";

const STORAGE_KEY = "calm-space-theme";

/**
 * Switches the whole site between two modes:
 *  - "day"   the default palette (tokens.css :root)
 *  - "night" a true dark mode built from the same brand colors
 *            (tokens.css [data-theme="night"])
 *
 * Every color in the app is already sourced from CSS custom properties, so
 * toggling data-theme on <html> re-skins the entire site instantly — no
 * per-page changes needed. The choice is remembered in localStorage and
 * otherwise falls back to the visitor's OS-level light/dark preference.
 */
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("day");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const prefersNight =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = saved === "night" || saved === "day" ? saved : prefersNight ? "night" : "day";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggleTheme() {
    const next = theme === "day" ? "night" : "day";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const isNight = theme === "night";

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isNight}
      aria-label={`Switch to ${isNight ? "day" : "night"} mode`}
      title={`Switch to ${isNight ? "day" : "night"} mode`}
    >
      <span className={`theme-toggle-track ${isNight ? "is-night" : ""}`}>
        <span className="theme-toggle-thumb">
          {isNight ? (
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" aria-hidden="true">
              <path
                d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 1.5v2.4M12 20.1v2.4M22.5 12h-2.4M3.9 12H1.5M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7M19.1 19.1l-1.7-1.7M6.6 6.6 4.9 4.9" />
              </g>
            </svg>
          )}
        </span>
      </span>
      <span className="theme-toggle-label">{isNight ? "Night" : "Day"}</span>
    </button>
  );
}
