"use client";

import { useTheme } from "./ThemeContext";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="dark-toggle p-2 w-20 min-h-[40px] rounded-lg text-lg transition-all duration-300"
    >
      {darkMode ? "Day" : "Night"}
    </button>
  );
}