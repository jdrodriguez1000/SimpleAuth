// [TSK-F-03.2] - SidebarNav: navegación lateral con active state tipo "píldora" — UI Kit §4.3
// Client Component: requiere usePathname() para detectar la ruta activa.

"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Definición de items de navegación ---

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isDestructive?: boolean;
}

const navItems: NavItem[] = [
  {
    label: "Mi Perfil",
    href: "/profile",
    icon: <User size={17} strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    label: "Seguridad",
    href: "/profile/security",
    icon: <Shield size={17} strokeWidth={1.75} aria-hidden="true" />,
  },
];

const logoutItem: NavItem = {
  label: "Cerrar sesión",
  href: "/auth/logout",
  icon: <LogOut size={17} strokeWidth={1.75} aria-hidden="true" />,
  isDestructive: true,
};

// --- Componente ---

function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    router.push("/auth/logout");
  }

  return (
    <nav
      aria-label="Menú lateral de perfil"
      className="flex flex-col py-4 gap-0.5"
    >
      {/* Items de navegación principal */}
      {navItems.map((item) => {
        /*
         * Active State (UI Kit §4.3):
         * — Indicador vertical "píldora" de 4px en --primary en el borde izquierdo.
         * — Texto en font-semibold.
         * — Sin fondo completo del item activo.
         */
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              // Layout del item
              "relative flex items-center gap-3",
              "px-5 py-2.5",
              "text-sm transition-colors duration-150 ease-in-out",
              // Estado normal
              "text-[var(--foreground)]",
              "hover:bg-[var(--accent)]",
              "focus-visible:outline-none focus-visible:bg-[var(--accent)]",
              // Estado activo: texto en semibold
              isActive
                ? "font-semibold text-[var(--primary)]"
                : "font-normal opacity-75 hover:opacity-100"
            )}
          >
            {/*
             * Indicador vertical de píldora (UI Kit §4.3):
             * — 4px de ancho, altura dinámica que sigue al padding del item.
             * — Solo visible en estado activo.
             * — Posicionado en el borde izquierdo absoluto del item.
             */}
            {isActive && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 inset-y-1",
                  "w-1 rounded-r-full",
                  "bg-[var(--primary)]"
                )}
              />
            )}

            {/* Ícono */}
            <span
              className={cn(
                "transition-colors duration-150",
                isActive ? "text-[var(--primary)]" : "opacity-50"
              )}
            >
              {item.icon}
            </span>

            {/* Label */}
            {item.label}
          </Link>
        );
      })}

      {/* Separador tonal antes del logout (No-Line Rule) */}
      <div
        aria-hidden="true"
        className="my-2 mx-4 h-px bg-[var(--surface-container-high)]"
      />

      {/* Botón de Cerrar sesión */}
      <button
        type="button"
        onClick={handleLogout}
        className={cn(
          "relative flex items-center gap-3 w-full",
          "px-5 py-2.5",
          "text-sm font-normal text-left",
          "text-[var(--error)] opacity-75",
          "hover:opacity-100",
          "hover:bg-[color-mix(in_srgb,var(--error)_8%,transparent)]",
          "transition-[background-color,opacity] duration-150 ease-in-out",
          "focus-visible:outline-none",
          "focus-visible:bg-[color-mix(in_srgb,var(--error)_8%,transparent)]"
        )}
      >
        <span className="opacity-70">{logoutItem.icon}</span>
        {logoutItem.label}
      </button>
    </nav>
  );
}

export default SidebarNav;
export { SidebarNav };
