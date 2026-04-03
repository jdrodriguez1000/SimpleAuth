// [TSK-F-03.2] - AppLayout: contenedor base para vistas protegidas — SPEC v1.3.0 §3.2 + §3.3
// [TSK-F-04] - Logo SVG premium integrado; placeholder ShieldCheck eliminado (G-11)
// Server Component: el estado de usuario es mock; los sub-componentes interactivos son Client.

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserNav } from "@/components/ui/UserNav";
import { SidebarNav } from "@/components/layouts/SidebarNav";
import { cn } from "@/lib/utils";

// --- Interfaz del componente ---

interface AppLayoutProps {
  children: React.ReactNode;
}

// --- Componente ---

function AppLayout({ children }: AppLayoutProps) {
  return (
    /*
     * Contenedor raíz: pantalla completa con distribución en columna.
     * Fondo: surface-container (SPEC §3.2 — más oscuro que surface-container-low del header).
     */
    <div
      className={cn(
        "min-h-screen flex flex-col",
        "bg-[var(--surface-container)]",
        "transition-[background-color] duration-300 ease-in-out"
      )}
    >
      {/* ===== HEADER PERSISTENTE ===== */}
      {/*
       * Fondo: surface-container-low — más claro que el área de contenido.
       * Sombra: shadow-card para separación sutil sin borde sólido (No-Line Rule).
       */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full",
          "flex items-center justify-between",
          "px-4 py-3 sm:px-6",
          "bg-[var(--surface-container-low)]",
          "shadow-card",
          "transition-[background-color] duration-300 ease-in-out"
        )}
      >
        {/* Logo — font-display (Manrope), color primary */}
        <Link
          href="/profile"
          aria-label="Ir al perfil"
          className={cn(
            "flex items-center gap-2",
            "hover:opacity-80 transition-opacity duration-200"
          )}
        >
          {/*
           * [TSK-F-04] Logo SVG artesanal — escudo + checkmark con gradiente primario.
           * priority: above the fold en el header persistente sticky.
           */}
          <Image
            src="/logo.svg"
            alt="SimpleAuth logo"
            width={26}
            height={26}
            priority
          />
          <span
            className={cn(
              "font-display font-700 text-lg tracking-tight",
              "text-[var(--primary)]",
              // Ocultar el texto en pantallas muy pequeñas para no saturar el header
              "hidden xs:inline"
            )}
          >
            SimpleAuth
          </span>
        </Link>

        {/* Controles del lado derecho */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </header>

      {/* ===== CUERPO: SIDEBAR + CONTENIDO ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/*
         * Sidebar de navegación de perfil.
         * Visible solo en md+ (w-56). En mobile la navegación vive en el dropdown de UserNav.
         * Fondo: surface-container-low — consistente con el header.
         */}
        <aside
          aria-label="Navegación de perfil"
          className={cn(
            "hidden md:flex md:flex-col",
            "w-56 shrink-0",
            "bg-[var(--surface-container-low)]",
            "transition-[background-color] duration-300 ease-in-out"
          )}
        >
          <SidebarNav />
        </aside>

        {/* Área de contenido principal */}
        <main
          className={cn(
            "flex-1 overflow-y-auto",
            "px-4 py-6 sm:px-6 lg:px-8"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
export { AppLayout };
