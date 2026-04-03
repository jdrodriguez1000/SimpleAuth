// [TSK-F-03.1] - Botón de cambio de tema dark/light (cliente) — SPEC v1.3.0 §3.2
// Requiere "use client" porque depende del hook useTheme de next-themes.

"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// --- Interfaz del componente ---

interface ThemeToggleProps {
  /** Clases adicionales para composición externa */
  className?: string;
}

// --- Componente ---

function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  // Evitar hidration mismatch: renderizar solo en cliente
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder con las mismas dimensiones para evitar layout shift
    return (
      <div
        aria-hidden="true"
        className={cn("h-8 w-8 rounded-[var(--radius-md)]", className)}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        // Ghost: sin fondo, solo hover sutil (UI Kit §2.1 — No-Line Rule)
        "inline-flex items-center justify-center rounded-[var(--radius-md)]",
        "h-8 w-8 cursor-pointer",
        "text-[var(--foreground)] opacity-70",
        "hover:bg-[var(--accent)] hover:opacity-100",
        "transition-[background-color,opacity] duration-200 ease-in-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-[color-mix(in_srgb,var(--primary)_40%,transparent)]",
        className
      )}
    >
      {isDark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
    </button>
  );
}

export default ThemeToggle;
export { ThemeToggle };
