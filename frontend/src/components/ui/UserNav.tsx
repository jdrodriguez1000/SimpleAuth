// [TSK-F-03.2] - UserNav: avatar con dropdown de navegación de usuario — SPEC v1.3.0 §3.3
// Client Component: necesita estado para abrir/cerrar el dropdown.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Shield, User } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

// --- Datos mock del usuario (prototipo — sin backend) ---

const mockUser = {
  name: "Juan Rodríguez",
  email: "juan@example.com",
  initials: "JR",
};

// --- Items del dropdown ---

interface DropdownItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isDestructive?: boolean;
}

const dropdownItems: DropdownItem[] = [
  {
    label: "Mi Perfil",
    href: "/profile",
    icon: <User size={15} strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    label: "Seguridad",
    href: "/profile/security",
    icon: <Shield size={15} strokeWidth={1.75} aria-hidden="true" />,
  },
];

// --- Interfaz del componente ---

interface UserNavProps {
  /** Clases adicionales para composición externa */
  className?: string;
}

// --- Componente ---

function UserNav({ className }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar al hacer click fuera del dropdown
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Cerrar al presionar Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    router.push("/auth/logout");
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* ===== BOTÓN AVATAR ===== */}
      <button
        type="button"
        aria-label={`Menú de usuario: ${mockUser.name}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          // Avatar: círculo con iniciales + gradiente primario
          "flex items-center justify-center rounded-full",
          "h-9 w-9 cursor-pointer select-none",
          "text-white text-sm font-semibold font-display",
          "transition-[opacity,transform] duration-200 ease-in-out",
          "hover:opacity-90 active:scale-95",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "focus-visible:outline-[color-mix(in_srgb,var(--primary)_40%,transparent)]"
        )}
        style={{ background: "var(--primary-gradient)" }}
      >
        <span aria-hidden="true">{mockUser.initials}</span>
      </button>

      {/* ===== DROPDOWN ===== */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Opciones de usuario"
          className={cn(
            // Posición: esquina superior derecha del avatar
            "absolute right-0 top-full mt-2 z-50",
            "w-52"
          )}
        >
          <GlassCard blur="sm" shadow="elevated" padding="none" opacity={0.92}>
            {/* Cabecera con nombre y email del usuario */}
            <div className="px-4 py-3">
              <p
                className={cn(
                  "text-sm font-semibold font-display leading-tight",
                  "text-[var(--foreground)]"
                )}
              >
                {mockUser.name}
              </p>
              <p
                className={cn(
                  "text-xs leading-tight mt-0.5",
                  "text-[var(--foreground)] opacity-55"
                )}
              >
                {mockUser.email}
              </p>
            </div>

            {/* Separador tonal (No-Line Rule: cambio de superficie, no borde sólido) */}
            <div
              aria-hidden="true"
              className="h-px bg-[var(--surface-container-high)]"
            />

            {/* Links de navegación */}
            <nav className="py-1">
              {dropdownItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5",
                    "text-sm text-[var(--foreground)]",
                    "hover:bg-[var(--accent)]",
                    "transition-colors duration-150 ease-in-out",
                    "focus-visible:outline-none focus-visible:bg-[var(--accent)]"
                  )}
                >
                  <span className="opacity-60">{item.icon}</span>
                  {item.label}
                </Link>
              ))}

              {/* Separador tonal antes del logout */}
              <div
                aria-hidden="true"
                className="my-1 h-px bg-[var(--surface-container-high)]"
              />

              {/* Acción de Logout */}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5",
                  "text-sm text-[var(--error)]",
                  "hover:bg-[color-mix(in_srgb,var(--error)_8%,transparent)]",
                  "transition-colors duration-150 ease-in-out",
                  "focus-visible:outline-none",
                  "focus-visible:bg-[color-mix(in_srgb,var(--error)_8%,transparent)]"
                )}
              >
                <LogOut size={15} strokeWidth={1.75} aria-hidden="true" />
                Cerrar sesión
              </button>
            </nav>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

export default UserNav;
export { UserNav };
