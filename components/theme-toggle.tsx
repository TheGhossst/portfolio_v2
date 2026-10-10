"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type ThemeName } from "@/lib/theme";

const THEME_EVENT = "archive-theme";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

function getSnapshot(): ThemeName {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): ThemeName {
  return "light";
}

function applyTheme(next: ThemeName) {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* The class still applies when storage is blocked. */
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

function commitTheme(next: ThemeName) {
  const root = document.documentElement;
  if (getSnapshot() === next) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof document.startViewTransition !== "function") {
    root.classList.remove("theme-switching");
    applyTheme(next);
    return;
  }

  root.classList.add("theme-switching");
  try {
    const transition = document.startViewTransition(() => {
      applyTheme(next);
    });
    transition.finished.finally(() => {
      root.classList.remove("theme-switching");
    });
  } catch {
    root.classList.remove("theme-switching");
    applyTheme(next);
  }
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={`font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink ${className}`}
      aria-pressed={theme === "dark"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => commitTheme(next)}
    >
      <span className="only-light">Dark</span>
      <span className="only-dark">Light</span>
    </button>
  );
}
